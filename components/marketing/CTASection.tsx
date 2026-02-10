import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Ready to Create Your Font?
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">
          Turn your handwriting into an installable font in under 3 minutes.
          Free to start, no account required.
        </p>
        <Button asChild size="lg" className="gap-2 text-base px-8 mt-6">
          <Link href="/create">
            Start Creating Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
