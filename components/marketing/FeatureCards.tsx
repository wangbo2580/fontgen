import { Upload, FileType, Clock, Globe, Smartphone, Shield } from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'Two Input Modes',
    description:
      'Upload a photo of your handwriting for the best quality, or write directly online for a quick start.',
  },
  {
    icon: FileType,
    title: 'Real Font Files',
    description:
      'Download actual .OTF files you can install on any computer. Not just images - real, installable fonts.',
  },
  {
    icon: Clock,
    title: '3 Minutes, Not 30',
    description:
      'Skip the printing, scanning, and waiting. Go from handwriting to font in under 3 minutes.',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description:
      'Use your font in Word, Photoshop, Illustrator, Canva, Google Docs, and any other app.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description:
      'Take a photo with your phone and upload directly. No scanner or desktop computer needed.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description:
      'Font generation happens in your browser. Your handwriting data never leaves your device.',
  },
];

export function FeatureCards() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Why FontGen?
          </h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            The fastest way to create custom fonts from your real handwriting
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-card p-6 hover:shadow-sm transition-shadow"
            >
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
