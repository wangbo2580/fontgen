import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStyleBySlug, getAllStyleSlugs } from '@/lib/seo-styles';
import { Check, ArrowRight, Pen } from 'lucide-react';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllStyleSlugs().map((style) => ({ style }));
}

interface PageProps {
  params: Promise<{ style: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { style: slug } = await params;
  const style = getStyleBySlug(slug);
  if (!style) return {};

  const title = `AI ${style.label} Font Generator - Create ${style.label} Fonts Online | FontGen`;
  const description = `Turn your handwriting into a beautiful ${style.label.toLowerCase()} font. Create custom AI-generated ${style.label.toLowerCase()} fonts online. Download .OTF/.TTF files instantly.`;

  return {
    title,
    description,
    openGraph: {
      title: `AI ${style.label} Font Generator`,
      description,
      type: 'website',
    },
    alternates: {
      canonical: `/ai-${slug}-font-generator`,
    },
  };
}

export default async function StylePage({ params }: PageProps) {
  const { style: slug } = await params;
  const style = getStyleBySlug(slug);
  if (!style) notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            AI {style.label} Font Generator
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Create custom {style.label.toLowerCase()} fonts from your handwriting in minutes.
            No design skills needed — just write, upload, and download.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              href="/create"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Create Your {style.label} Font
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

      {/* About this style */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">
            What is a {style.label} Font?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {style.description}
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Create Your {style.label} Font in 3 Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Write Your Letters',
                desc: `Write A-Z in your ${style.label.toLowerCase()} style on our template or directly in the browser canvas.`,
              },
              {
                step: '2',
                title: 'Upload & Process',
                desc: 'Take a photo or scan your template. Our AI automatically identifies and extracts each character.',
              },
              {
                step: '3',
                title: 'Download Your Font',
                desc: `Get your custom ${style.label.toLowerCase()} font as an installable .OTF file. Use it in any application.`,
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">
            Perfect for {style.label} Projects
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {style.useCases.map((uc, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-lg border bg-card"
              >
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">{uc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Preview */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Your Handwriting, Your {style.label} Font
          </h2>
          <p className="text-muted-foreground mb-8">
            Write the alphabet in your {style.label.toLowerCase()} style, and FontGen turns it into a real font file
          </p>
          <div className="bg-white border rounded-xl p-8 md:p-12">
            <div className="flex items-center justify-center gap-6 text-muted-foreground text-sm mb-6">
              <span>Your handwriting</span>
              <ArrowRight className="w-4 h-4" />
              <span>Installable .OTF font</span>
            </div>
            <p className="text-2xl md:text-3xl text-foreground/70">
              &ldquo;{style.sampleText}&rdquo;
            </p>
            <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
              <Pen className="w-3.5 h-3.5" />
              The final font will match your own {style.label.toLowerCase()} handwriting
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {style.label} Font FAQ
          </h2>
          <div className="space-y-4">
            {style.faqs.map((faq, i) => (
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

      {/* Bottom CTA */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Ready to Create Your {style.label} Font?
          </h2>
          <p className="text-muted-foreground mb-6">
            Turn your handwriting into a real, installable font in minutes.
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
