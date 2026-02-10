'use client';

import Link from 'next/link';
import { PricingCards } from '@/components/features/PricingCards';
import { PlanTier } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function PricingPageContent() {
  const handleSelect = (tier: PlanTier) => {
    // For now, redirect to create page
    window.location.href = '/create';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">
            Simple, One-Time Pricing
          </h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
            No subscriptions. Pay once, download your font forever.
            Start with a free preview, then upgrade when you&apos;re ready.
          </p>
        </div>

        <PricingCards onSelect={handleSelect} />

        <div className="text-center mt-12 space-y-4">
          <p className="text-sm text-muted-foreground">
            All plans include instant font generation and live preview.
            Paid plans coming soon with PayPal checkout.
          </p>
          <Button asChild>
            <Link href="/create">
              Try Free Preview
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
