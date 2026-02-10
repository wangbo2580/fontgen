import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PenTool } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <PenTool className="w-5 h-5 text-primary" />
          <span>FontGen</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/#how-it-works"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            How It Works
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Pricing
          </Link>
          <Button asChild size="sm">
            <Link href="/create">Start Free</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
