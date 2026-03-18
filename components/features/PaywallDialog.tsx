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
import { Check, Download, Lock, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const paidTiers: PlanTier[] = ['basic', 'pro', 'business'];

  const paypalConfigured = typeof window !== 'undefined';

  const handlePaymentClick = async (tier: PlanTier) => {
    setSelectedTier(tier);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Create PayPal order
      const createRes = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.error || 'Failed to create payment');
      }

      const { id: orderId } = await createRes.json();

      // Redirect to PayPal approval URL
      const paypalUrl = process.env.NEXT_PUBLIC_PAYPAL_MODE === 'live'
        ? `https://www.paypal.com/checkoutnow?token=${orderId}`
        : `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`;

      window.open(paypalUrl, '_blank', 'width=500,height=700');

      // Show waiting state with manual capture button
      setPaymentStatus('idle');
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    }
  };

  const handleDownloadPaid = (name: string) => {
    if (!fontBuffer) return;
    const blob = new Blob([fontBuffer], { type: 'font/otf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name || 'MyHandwriting'}.otf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    setSelectedTier(null);
    setPaymentStatus('idle');
    setErrorMessage('');
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

        {paymentStatus === 'success' ? (
          /* Payment success */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Payment Successful!</h3>
              <p className="text-muted-foreground mt-2">
                Your font is ready to download.
              </p>
            </div>
            <Button onClick={() => handleDownloadPaid('MyHandwriting')} className="gap-2">
              <Download className="w-4 h-4" />
              Download Font (.otf)
            </Button>
          </div>
        ) : !selectedTier ? (
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
                    Download with 26 uppercase letters only. Perfect for testing.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={onFreePreview}>
                  Download Free
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
                        Buy Now
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Secure payment via PayPal. No subscription — pay once, keep forever.
            </p>
          </div>
        ) : (
          /* Payment processing / error state */
          <div className="py-8 text-center space-y-4">
            {paymentStatus === 'processing' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {PLAN_DATA[selectedTier].label} — ${PLAN_DATA[selectedTier].price}
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Connecting to PayPal...
                  </p>
                </div>
              </>
            ) : paymentStatus === 'error' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Payment Error</h3>
                  <p className="text-muted-foreground mt-2">
                    {errorMessage}
                  </p>
                  {errorMessage.includes('not configured') && (
                    <p className="text-sm text-muted-foreground mt-1">
                      PayPal payments are being set up. Try the free preview for now!
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {PLAN_DATA[selectedTier].label} — ${PLAN_DATA[selectedTier].price}
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Complete your payment in the PayPal window.
                  </p>
                </div>
              </>
            )}

            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-1.5" />
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
