'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface FontPreviewProps {
  fontUrl: string | null;
  fontFamily: string;
}

const PRESET_SIZES = [24, 36, 48, 72];
const DEFAULT_TEXT = 'The Quick Brown Fox Jumps Over The Lazy Dog 0123456789';

export function FontPreview({ fontUrl, fontFamily }: FontPreviewProps) {
  const [previewText, setPreviewText] = useState(DEFAULT_TEXT);
  const [fontSize, setFontSize] = useState(48);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!fontUrl) return;

    // Remove old style
    if (styleRef.current) {
      styleRef.current.remove();
    }

    // Create new @font-face style
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: '${fontFamily}';
        src: url('${fontUrl}') format('opentype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
    styleRef.current = style;

    return () => {
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    };
  }, [fontUrl, fontFamily]);

  if (!fontUrl) return null;

  return (
    <div className="space-y-4 border rounded-xl p-6 bg-card">
      <h3 className="font-semibold text-lg">Preview</h3>

      {/* Preview text input */}
      <input
        type="text"
        value={previewText}
        onChange={(e) => setPreviewText(e.target.value)}
        placeholder="Type to preview..."
        className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
      />

      {/* Font size selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Size:</span>
        {PRESET_SIZES.map((size) => (
          <Button
            key={size}
            variant={fontSize === size ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFontSize(size)}
          >
            {size}px
          </Button>
        ))}
      </div>

      {/* Preview area */}
      <div
        className="min-h-[120px] p-6 border rounded-lg bg-white overflow-auto"
        style={{
          fontFamily: `'${fontFamily}', sans-serif`,
          fontSize: `${fontSize}px`,
          lineHeight: 1.4,
          wordBreak: 'break-word',
        }}
      >
        {previewText || 'Type something to preview...'}
      </div>
    </div>
  );
}
