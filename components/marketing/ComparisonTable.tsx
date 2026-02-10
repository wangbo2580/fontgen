import { Check, X } from 'lucide-react';

const comparisons = [
  {
    feature: 'Create font from phone photo',
    fontgen: true,
    calligraphr: 'Scan only',
    refont: false,
  },
  {
    feature: 'Browser-based writing canvas',
    fontgen: true,
    calligraphr: true,
    refont: false,
  },
  {
    feature: 'Real font file output (.OTF)',
    fontgen: true,
    calligraphr: true,
    refont: false,
  },
  {
    feature: 'No template printing required',
    fontgen: 'Canvas mode',
    calligraphr: false,
    refont: true,
  },
  {
    feature: 'Typical time to create',
    fontgen: '~3 min',
    calligraphr: '~15 min',
    refont: '~1 min',
  },
  {
    feature: 'Client-side font generation',
    fontgen: true,
    calligraphr: false,
    refont: false,
  },
  {
    feature: 'Free tier available',
    fontgen: true,
    calligraphr: true,
    refont: true,
  },
];

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === 'string') {
    return <span className="text-sm font-medium">{value}</span>;
  }
  if (value) {
    return <Check className="w-4 h-4 text-green-600 mx-auto" />;
  }
  return <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />;
}

export function ComparisonTable() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            How We Compare
          </h2>
          <p className="text-muted-foreground mt-2">
            FontGen vs other font creation tools
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Feature
                </th>
                <th className="text-center py-3 px-4 text-sm font-bold text-primary">
                  FontGen
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  Calligraphr
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  Refont.ai
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row) => (
                <tr key={row.feature} className="border-b last:border-0">
                  <td className="py-3 px-4 text-sm">{row.feature}</td>
                  <td className="py-3 px-4 text-center bg-primary/5">
                    <CellValue value={row.fontgen} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CellValue value={row.calligraphr} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CellValue value={row.refont} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Based on publicly available information. Features may have changed since last review.
        </p>
      </div>
    </section>
  );
}
