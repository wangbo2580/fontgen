import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLandingPageBySlug, getAllLandingPageSlugs, FONT_STYLES, SEO_LANDING_PAGES } from '@/lib/seo-styles';
import { Check, ArrowRight } from 'lucide-react';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllLandingPageSlugs().map((landing) => ({ landing }));
}

interface PageProps {
  params: Promise<{ landing: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { landing: slug } = await params;
  const page = getLandingPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.h1,
      description: page.description,
      type: 'website',
    },
    alternates: {
      canonical: `/${slug}`,
    },
  };
}

export default async function LandingPage({ params }: PageProps) {
  const { landing: slug } = await params;
  const page = getLandingPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {page.h1}
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            {page.intro}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              href="/create"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Start Creating Your Font
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Why Use FontGen?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {page.benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-lg border bg-card"
              >
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {page.steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">
            FontGen vs Traditional Methods
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Feature</th>
                  <th className="text-center p-3 font-semibold">FontGen</th>
                  <th className="text-center p-3 font-semibold">Template-based tools</th>
                  <th className="text-center p-3 font-semibold">Professional font editors</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Time to create', '< 10 min', '30-60 min', 'Hours to days'],
                  ['Template printing required', 'No', 'Yes', 'No'],
                  ['Scanner needed', 'No (phone camera)', 'Yes / phone', 'No'],
                  ['Learning curve', 'None', 'Low', 'Steep'],
                  ['AI letter detection', 'Yes', 'No', 'No'],
                  ['Output format', '.OTF', '.TTF/.OTF', '.OTF/.TTF/.WOFF'],
                ].map(([feature, fontgen, template, pro], i) => (
                  <tr key={i} className="border-b">
                    <td className="p-3 font-medium">{feature}</td>
                    <td className="p-3 text-center text-primary font-medium">{fontgen}</td>
                    <td className="p-3 text-center text-muted-foreground">{template}</td>
                    <td className="p-3 text-center text-muted-foreground">{pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {page.faqs.map((faq, i) => (
              <details
                key={i}
                className="group border rounded-lg bg-card"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-sm">
                  {faq.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform ml-2">
                    ▼
                  </span>
                </summary>
                <div className="px-4 pb-4 text-sm text-muted-foreground">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related pages */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Explore Font Styles
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
            {FONT_STYLES.slice(0, 8).map((s) => (
              <Link
                key={s.slug}
                href={`/ai-${s.slug}-font-generator`}
                className="text-center p-3 border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <span className="text-sm font-medium">{s.label}</span>
                <span className="block text-xs text-muted-foreground mt-1">Font Generator</span>
              </Link>
            ))}
          </div>

          {/* Related landing pages */}
          <div className="flex flex-wrap gap-2 justify-center">
            {SEO_LANDING_PAGES.filter((p) => p.slug !== slug).map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="text-xs text-muted-foreground hover:text-foreground border rounded-full px-3 py-1 transition-colors"
              >
                {p.h1}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Ready to Turn Your Handwriting into a Font?
          </h2>
          <p className="text-muted-foreground mb-6">
            Write the alphabet once. Get a font you can use forever.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-lg"
          >
            Start Creating — It&apos;s Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
