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

const PLAN_PRICES: Record<string, { amount: string; description: string }> = {
  basic: { amount: '9.99', description: 'FontGen Basic - A-Z + a-z + 0-9 (.OTF)' },
  pro: { amount: '19.99', description: 'FontGen Pro - Full character set (.OTF + .TTF)' },
  business: { amount: '39.99', description: 'FontGen Business - Full set + Commercial License (.OTF + .TTF + .WOFF2)' },
};

export async function POST(request: NextRequest) {
  try {
    const { tier } = await request.json();

    if (!tier || !PLAN_PRICES[tier]) {
      return NextResponse.json({ error: 'Invalid plan tier' }, { status: 400 });
    }

    const plan = PLAN_PRICES[tier];
    const accessToken = await getAccessToken();

    const orderRes = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: plan.amount,
          },
          description: plan.description,
        }],
        application_context: {
          brand_name: 'FontGen',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
        },
      }),
    });

    if (!orderRes.ok) {
      const errText = await orderRes.text();
      console.error('PayPal create order failed:', errText);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 502 });
    }

    const order = await orderRes.json();
    return NextResponse.json({ id: order.id });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
