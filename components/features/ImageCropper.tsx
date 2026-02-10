'use client';

import { useEffect, useRef, useMemo } from 'react';
import { CharacterCropResult, GRID_COLS } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';

interface ImageCropperProps {
  results: CharacterCropResult[];
  method: 'ai' | 'fallback';
  onConfirm: (results: CharacterCropResult[]) => void;
  onRetry: () => void;
}

export function ImageCropper({ results, method, onConfirm, onRetry }: ImageCropperProps) {
  const goodCount = useMemo(
    () => results.filter((r) => r.qualityScore >= 60).length,
    [results]
  );

  const warningCount = useMemo(
    () => results.filter((r) => r.qualityScore > 0 && r.qualityScore < 60).length,
    [results]
  );

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={method === 'ai' ? 'default' : 'secondary'}>
            {method === 'ai' ? 'AI Processed' : 'Auto Detected'}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {goodCount} clear, {warningCount} need attention
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onRetry}>
          <RotateCcw className="w-4 h-4 mr-1" />
          Re-upload
        </Button>
      </div>

      {/* Character grid */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
        }}
      >
        {results.map((result) => (
          <CharacterPreview key={result.letter} result={result} />
        ))}
      </div>

      {/* Confirm button */}
      <div className="flex justify-center pt-2">
        <Button onClick={() => onConfirm(results)} size="lg">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Confirm & Generate Font
        </Button>
      </div>
    </div>
  );
}

function CharacterPreview({ result }: { result: CharacterCropResult }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result.imageData) return;

    const ctx = canvas.getContext('2d')!;
    canvas.width = result.imageData.width;
    canvas.height = result.imageData.height;
    ctx.putImageData(result.imageData, 0, 0);
  }, [result.imageData]);

  const isGood = result.qualityScore >= 60;
  const isWarning = result.qualityScore > 0 && result.qualityScore < 60;
  const isEmpty = result.qualityScore === 0;

  return (
    <div
      className={`relative border rounded-lg overflow-hidden ${
        isWarning
          ? 'border-orange-400'
          : isEmpty
          ? 'border-muted'
          : 'border-border'
      }`}
    >
      {/* Letter label */}
      <div className="absolute top-0.5 left-1 text-[10px] font-medium text-muted-foreground/50 z-10">
        {result.letter}
      </div>

      {/* Quality indicator */}
      {isWarning && (
        <div className="absolute top-0.5 right-1 z-10">
          <AlertTriangle className="w-3 h-3 text-orange-400" />
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full aspect-square bg-white"
        style={{ imageRendering: 'auto' }}
      />

      {/* Quality score */}
      {!isEmpty && (
        <div
          className={`text-[9px] text-center py-0.5 ${
            isGood ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'
          }`}
        >
          {result.qualityScore}%
        </div>
      )}
    </div>
  );
}
