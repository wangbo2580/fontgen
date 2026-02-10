import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'AI Font Generator from Handwriting - Create Custom Fonts Online Free | FontGen',
    template: '%s | FontGen',
  },
  description:
    'Turn your handwriting into a real font file (.OTF/.TTF) in 3 minutes. Upload a photo or write online - no printing, no scanning. Free to try.',
  keywords: [
    'ai font generator',
    'handwriting to font',
    'custom font creator',
    'ai font generator from handwriting',
    'ai calligraphy generator',
    'ai signature font generator',
    'create font from handwriting',
    'handwriting font maker',
    'otf font generator',
  ],
  openGraph: {
    title: 'FontGen - Turn Your Handwriting into a Real Font',
    description:
      'Create custom .OTF font files from your handwriting in 3 minutes. No printing, no scanning.',
    type: 'website',
    locale: 'en_US',
    siteName: 'FontGen',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FontGen - AI Font Generator from Handwriting',
    description:
      'Turn handwriting into installable font files in 3 minutes. Free to try.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'FontGen - AI Font Generator',
              applicationCategory: 'DesignApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              description:
                'Turn handwriting into real font files (.OTF/.TTF) online. Upload a photo or write in browser.',
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
