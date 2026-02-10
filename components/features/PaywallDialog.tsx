'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PLAN_DATA, PlanTier } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Download, Lock } from 'lucide-react';

interface PaywallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFreePreview: () => void;
  fontBuffer: ArrayBuffer | null;
}

export function PaywallDialog({
  open,
  onOpenChange,
  onFreePreview,
  fontBuffer,
}: PaywallDialogProps) {
  const [selectedTier, setSelectedTier] = useState<PlanTier | null>(null);

  const paidTiers: PlanTier[] = ['basic', 'pro', 'business'];

  const handlePaymentClick = (tier: PlanTier) => {
    setSelectedTier(tier);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Download Your Font</DialogTitle>
          <DialogDescription>
            Choose a plan to download your custom handwriting font
          </DialogDescription>
        </DialogHeader>

        {!selectedTier ? (
          <div className="space-y-4 mt-2">
            {/* Free option */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    Free Preview
                    <Badge variant="secondary" className="text-xs">A-Z only</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Preview your font with 26 uppercase letters. Watermarked.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={onFreePreview}>
                  Preview
                </Button>
              </div>
            </div>

            {/* Paid options */}
            <div className="grid gap-3">
              {paidTiers.map((tier) => {
                const plan = PLAN_DATA[tier];
                const isPopular = tier === 'pro';

                return (
                  <div
                    key={tier}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-colors hover:border-primary/50 ${
                      isPopular ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handlePaymentClick(tier)}
                  >
                    {isPopular && (
                      <Badge className="absolute -top-2.5 right-4 text-xs">
                        Most Popular
                      </Badge>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {plan.label}
                          <span className="ml-2 text-lg font-bold">${plan.price}</span>
                          <span className="text-xs text-muted-foreground ml-1">one-time</span>
                        </h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                          {plan.features.map((f, i) => (
                            <span key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                              <Check className="w-3 h-3 text-primary" />
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant={isPopular ? 'default' : 'outline'}
                        size="sm"
                        className="shrink-0 ml-4 gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Select
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Payment pending state */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {PLAN_DATA[selectedTier].label} — ${PLAN_DATA[selectedTier].price}
              </h3>
              <p className="text-muted-foreground mt-2">
                Payment integration is being set up.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                PayPal checkout will be available soon. Please check back later!
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => setSelectedTier(null)}>
                Back to Plans
              </Button>
              <Button variant="outline" onClick={onFreePreview}>
                <Download className="w-4 h-4 mr-1.5" />
                Use Free Preview
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
