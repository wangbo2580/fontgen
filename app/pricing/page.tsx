import { Metadata } from 'next';
import { PricingPageContent } from './PricingPageContent';

export const metadata: Metadata = {
  title: 'Pricing - FontGen | AI Handwriting Font Generator',
  description:
    'Simple one-time pricing. Create custom handwriting fonts from $9.99. No subscription. Download .OTF, .TTF, and .WOFF2 font files.',
  openGraph: {
    title: 'Pricing - FontGen',
    description: 'Simple one-time pricing for custom handwriting fonts.',
  },
};

export default function PricingPage() {
  return <PricingPageContent />;
}
