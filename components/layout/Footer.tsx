import Link from 'next/link';
import { PenTool } from 'lucide-react';

const fontStyles = [
  { slug: 'calligraphy', label: 'Calligraphy' },
  { slug: 'signature', label: 'Signature' },
  { slug: 'cursive', label: 'Cursive' },
  { slug: 'handwritten', label: 'Handwritten' },
  { slug: 'gothic', label: 'Gothic' },
  { slug: 'brush', label: 'Brush' },
  { slug: 'comic', label: 'Comic' },
  { slug: 'wedding', label: 'Wedding' },
];

const landingPages = [
  { slug: 'handwriting-to-font', label: 'Handwriting to Font' },
  { slug: 'text-to-handwriting-converter', label: 'Text to Handwriting' },
  { slug: 'create-font-from-handwriting', label: 'Create Font from Handwriting' },
  { slug: 'handwriting-font-maker', label: 'Font Maker' },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 text-sm font-semibold mb-3">
              <PenTool className="w-4 h-4" />
              <span>FontGen</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Turn your handwriting into installable font files. Upload a photo or write in the browser.
            </p>
          </div>

          {/* Font Styles */}
          <div>
            <h4 className="text-sm font-medium mb-3">Font Styles</h4>
            <ul className="space-y-1.5">
              {fontStyles.map((style) => (
                <li key={style.slug}>
                  <Link
                    href={`/ai-${style.slug}-font-generator`}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    AI {style.label} Font
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-sm font-medium mb-3">Tools</h4>
            <ul className="space-y-1.5">
              {landingPages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/${page.slug}`}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-medium mb-3">Company</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} FontGen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
