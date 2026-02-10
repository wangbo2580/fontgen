import { HeroSection } from '@/components/marketing/HeroSection';
import { FeatureCards } from '@/components/marketing/FeatureCards';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { ComparisonTable } from '@/components/marketing/ComparisonTable';
import { FAQSection } from '@/components/marketing/FAQSection';
import { CTASection } from '@/components/marketing/CTASection';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Separator />
      <FeatureCards />
      <HowItWorks />
      <Separator />
      <ComparisonTable />
      <FAQSection />
      <Separator />
      <CTASection />
    </>
  );
}
