import Link from 'next/link';
import { PenTool } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <PenTool className="w-4 h-4" />
            <span>FontGen - Turn Handwriting into Fonts</span>
          </div>

          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </nav>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          &copy; {new Date().getFullYear()} FontGen. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
