'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How do I turn my handwriting into a font?',
    answer:
      'Two ways: write the alphabet directly in the browser canvas, or write on paper and upload a photo. Either way, FontGen traces each letter and builds an installable .OTF font file. The whole process takes a few minutes.',
  },
  {
    question: 'What format is the font file?',
    answer:
      '.OTF (OpenType Font). It works on Windows, macOS, and Linux, and in design software like Photoshop, Illustrator, Figma, Canva, and Word. Paid plans also include .TTF and .WOFF2 formats.',
  },
  {
    question: 'Can I use the font commercially?',
    answer:
      'The free version is for personal use only. The Business plan ($39.99) includes a commercial use license for client work, products, and branding. Paid plans are not available yet — they will launch with PayPal checkout.',
  },
  {
    question: 'Do I need a scanner or printer?',
    answer:
      'No. You can either write directly in the browser canvas (nothing to print or scan), or write on any piece of paper and photograph it with your phone. A downloadable template is available if you want a guide, but it is optional.',
  },
  {
    question: 'Is my handwriting data stored on your servers?',
    answer:
      'Font generation runs in your browser. Canvas mode is fully client-side — nothing leaves your device. If you upload a photo, the image may be sent to a third-party AI service (via OpenRouter) for character detection. This happens in real-time and the image is not stored. If the AI service is unavailable, it falls back to client-side processing.',
  },
  {
    question: 'What if some letters look bad?',
    answer:
      'You can rewrite individual letters in the canvas or re-upload a better photo. The preview feature lets you type and test before downloading, so you can spot issues and fix them.',
  },
  {
    question: 'Does it support lowercase letters and numbers?',
    answer:
      'The free version covers A-Z uppercase (26 characters). The Basic plan adds lowercase a-z and 0-9 (62 total). Pro and Business plans include punctuation and special characters (90+ total).',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-lg bg-card overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                <span className="font-medium text-sm pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
