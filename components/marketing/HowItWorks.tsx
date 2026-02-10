import { PenLine, Cpu, Download } from 'lucide-react';

const steps = [
  {
    icon: PenLine,
    step: '1',
    title: 'Write',
    description:
      'Write A-Z on paper and take a photo, or write directly in your browser.',
  },
  {
    icon: Cpu,
    step: '2',
    title: 'Generate',
    description:
      'Our engine converts your handwriting into smooth vector paths and assembles your font.',
  },
  {
    icon: Download,
    step: '3',
    title: 'Download',
    description:
      'Preview your font, then download the .OTF file. Install it and start using it anywhere.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            How It Works
          </h2>
          <p className="text-muted-foreground mt-2">
            Three simple steps to your custom font
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-7 h-7" />
              </div>
              <div className="text-sm font-medium text-primary mb-1">
                Step {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
