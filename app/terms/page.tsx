import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <p>Last updated: February 10, 2026</p>

        <h2 className="text-xl font-semibold text-foreground">Service Description</h2>
        <p>
          FontGen is a web-based tool that converts handwriting into installable font files (.OTF).
          You can write directly in the browser canvas, or upload a photo of your handwriting.
          The service is provided &quot;as is&quot; without warranties of any kind.
        </p>

        <h2 className="text-xl font-semibold text-foreground">How It Works</h2>
        <p>
          When you use the browser canvas, all processing happens locally in your browser.
          When you upload a handwriting photo, the image may be sent to a third-party AI service
          for character detection. Font generation itself is performed client-side using your browser.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Font Ownership</h2>
        <p>
          Fonts generated from your handwriting belong to you. You retain full ownership of
          any fonts created using this tool.
        </p>

        <h2 className="text-xl font-semibold text-foreground">License Tiers</h2>
        <p>
          Paid plans are not yet available. When launched, the planned tiers are:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Free:</strong> A-Z uppercase preview (personal, non-commercial use)</li>
          <li><strong>Basic ($9.99):</strong> A-Z + a-z + 0-9, .OTF download, personal use</li>
          <li><strong>Pro ($19.99):</strong> Full character set, .OTF + .TTF download, personal use</li>
          <li><strong>Business ($39.99):</strong> Full character set, all formats, commercial use license</li>
        </ul>
        <p>
          Pricing and features may change before launch. The free tier is available now.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Refund Policy</h2>
        <p>
          Due to the digital nature of font files, refunds will be handled on a case-by-case basis.
          If you experience technical issues that prevent you from using a purchased font,
          contact us within 7 days of purchase.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Contact</h2>
        <p>
          If you have questions about these terms, please open an issue on our GitHub repository
          or reach out via the contact method listed on our website.
        </p>
      </div>
    </div>
  );
}
