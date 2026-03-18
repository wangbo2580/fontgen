import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !secret) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const res = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    throw new Error(`PayPal auth failed: ${res.status}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    const captureRes = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!captureRes.ok) {
      const errText = await captureRes.text();
      console.error('PayPal capture failed:', errText);
      return NextResponse.json({ error: 'Payment capture failed' }, { status: 502 });
    }

    const captureData = await captureRes.json();
    const status = captureData.status;

    if (status === 'COMPLETED') {
      return NextResponse.json({
        success: true,
        orderId: captureData.id,
        payer: captureData.payer?.email_address,
      });
    }

    return NextResponse.json({
      success: false,
      status,
      error: 'Payment not completed',
    }, { status: 400 });
  } catch (error) {
    console.error('Capture error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
