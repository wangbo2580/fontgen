import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <p>Last updated: February 10, 2026</p>

        <h2 className="text-xl font-semibold text-foreground">How Font Generation Works</h2>
        <p>
          When you use the browser canvas to write letters, all processing happens locally in your browser.
          Your handwriting data stays on your device and is never sent to any server.
        </p>
        <p>
          When you use the image upload feature, your handwriting photo may be sent to a third-party
          AI service (via OpenRouter) for character detection. This processing happens in real-time
          and the image is not stored by us. If the AI service is unavailable, processing falls back
          to a fully client-side method.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Data We Collect</h2>
        <p>
          We do not collect personal information or require user accounts. We do not use tracking cookies.
          Basic server logs (IP addresses, page URLs) may be retained temporarily for security and
          debugging purposes.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Payment Data</h2>
        <p>
          When paid plans become available, payments will be processed through PayPal.
          We do not store your payment details — all payment information is handled directly by PayPal.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Third-Party Services</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Vercel (hosting)</li>
          <li>OpenRouter / Google Gemini (optional AI image processing)</li>
          <li>PayPal (payment processing, when available)</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">Contact</h2>
        <p>
          If you have questions about this privacy policy, please open an issue on our GitHub repository
          or reach out via the contact method listed on our website.
        </p>
      </div>
    </div>
  );
}
