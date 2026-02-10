import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,hsl(var(--primary)/0.08),transparent)]" />

      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-1.5 bg-primary/5 text-primary rounded-full px-3 py-1 text-sm font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Free to try - No sign up needed
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
          Turn Your Handwriting
          <br />
          <span className="text-primary">into a Real Font</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
          Create custom .OTF font files from your handwriting in minutes.
          Write in the browser or snap a photo — no template printing or scanner required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Button asChild size="lg" className="gap-2 text-base px-8">
            <Link href="/create">
              Start Creating - It&apos;s Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          No account required. Your font is generated in your browser.
        </p>

        {/* Hero visual - simple animated text */}
        <div className="mt-12 rounded-xl border bg-card p-8 shadow-sm max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-4 text-muted-foreground text-sm mb-4">
            <span className="font-mono">Your handwriting</span>
            <ArrowRight className="w-4 h-4" />
            <span className="font-mono">Installable font file</span>
          </div>
          <div className="text-3xl sm:text-4xl font-serif italic text-center leading-relaxed">
            &ldquo;Hello World&rdquo;
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Works in Word, Photoshop, Canva, and any app that supports fonts
          </p>
        </div>
      </div>
    </section>
  );
}
