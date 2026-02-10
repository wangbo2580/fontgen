'use client';

import { PLAN_DATA, PlanTier } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Clock } from 'lucide-react';

interface PricingCardsProps {
  onSelect: (tier: PlanTier) => void;
  currentTier?: PlanTier;
}

export function PricingCards({ onSelect, currentTier }: PricingCardsProps) {
  const tiers: PlanTier[] = ['free', 'basic', 'pro', 'business'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiers.map((tier) => {
        const plan = PLAN_DATA[tier];
        const isPopular = tier === 'pro';
        const isActive = currentTier === tier;

        return (
          <div
            key={tier}
            className={`relative rounded-xl border p-5 flex flex-col ${
              isPopular
                ? 'border-primary shadow-md ring-1 ring-primary/20'
                : 'border-border'
            } ${isActive ? 'bg-primary/5' : 'bg-card'}`}
          >
            {isPopular && (
              <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs">
                Best Value
              </Badge>
            )}

            <div className="mb-4">
              <h3 className="font-semibold text-lg">{plan.label}</h3>
              <div className="mt-2">
                {plan.price === 0 ? (
                  <span className="text-2xl font-bold">Free</span>
                ) : (
                  <>
                    <span className="text-2xl font-bold">${plan.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">one-time</span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {plan.charCount} characters &middot; {plan.formats.join(', ')}
              </p>
            </div>

            <ul className="space-y-2 mb-5 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {tier === 'free' ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onSelect(tier)}
              >
                Preview Only
              </Button>
            ) : (
              <Button
                variant={isPopular ? 'default' : 'outline'}
                className="w-full gap-2"
                onClick={() => onSelect(tier)}
              >
                <Clock className="w-4 h-4" />
                Coming Soon
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
