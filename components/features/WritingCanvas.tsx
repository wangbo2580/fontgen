'use client';

import { useEffect, useRef } from 'react';
import { useWritingCanvas } from '@/hooks/useWritingCanvas';
import { CANVAS_SIZE } from '@/types';
import { X } from 'lucide-react';

interface WritingCanvasProps {
  letter: string;
  strokeWidth: number;
  onContentChange?: (letter: string, hasContent: boolean) => void;
  getImageDataRef?: (getter: () => ImageData | null) => void;
}

export function WritingCanvas({
  letter,
  strokeWidth,
  onContentChange,
  getImageDataRef,
}: WritingCanvasProps) {
  const { canvasRef, hasContent, clear, getImageData } = useWritingCanvas({
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    strokeWidth,
  });

  // Expose getImageData to parent via ref callback (only once on mount)
  const getImageDataRefStable = useRef(getImageDataRef);
  getImageDataRefStable.current = getImageDataRef;

  useEffect(() => {
    getImageDataRefStable.current?.(getImageData);
  }, [getImageData]);

  // Notify parent of content changes via useEffect (not during render)
  useEffect(() => {
    onContentChange?.(letter, hasContent);
  }, [letter, hasContent, onContentChange]);

  return (
    <div className="relative group">
      <div className="border border-border rounded-lg overflow-hidden bg-white">
        {/* Letter label */}
        <div className="absolute top-1 left-2 text-xs font-medium text-muted-foreground/50 select-none pointer-events-none z-10">
          {letter}
        </div>

        {/* Baseline guide */}
        <div
          className="absolute left-0 right-0 border-t border-dashed border-muted-foreground/20 pointer-events-none z-10"
          style={{ top: '70%' }}
        />

        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="w-full aspect-square cursor-crosshair touch-none"
        />
      </div>

      {/* Clear button */}
      {hasContent && (
        <button
          onClick={clear}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
          title="Clear"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
