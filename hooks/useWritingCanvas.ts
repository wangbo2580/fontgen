'use client';

import { useRef, useCallback, useEffect, useState } from 'react';

interface UseWritingCanvasOptions {
  width?: number;
  height?: number;
  strokeWidth?: number;
  strokeColor?: string;
}

export function useWritingCanvas(options: UseWritingCanvasOptions = {}) {
  const {
    width = 200,
    height = 200,
    strokeWidth = 3,
    strokeColor = '#000000',
  } = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [hasContent, setHasContent] = useState(false);

  // Store strokeWidth/color in refs so event handlers always use latest values
  // without causing effect re-runs
  const strokeWidthRef = useRef(strokeWidth);
  const strokeColorRef = useRef(strokeColor);
  strokeWidthRef.current = strokeWidth;
  strokeColorRef.current = strokeColor;

  const getPos = useCallback(
    (e: PointerEvent): { x: number; y: number } => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const startDrawing = useCallback(
    (e: PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      isDrawing.current = true;
      const pos = getPos(e);
      lastPos.current = pos;

      const ctx = canvas.getContext('2d')!;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, strokeWidthRef.current / 2, 0, Math.PI * 2);
      ctx.fillStyle = strokeColorRef.current;
      ctx.fill();

      canvas.setPointerCapture(e.pointerId);
    },
    [getPos]
  );

  const draw = useCallback(
    (e: PointerEvent) => {
      if (!isDrawing.current || !lastPos.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d')!;
      const pos = getPos(e);

      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = strokeColorRef.current;
      ctx.lineWidth = strokeWidthRef.current;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      lastPos.current = pos;
      setHasContent(true);
    },
    [getPos]
  );

  const stopDrawing = useCallback(() => {
    isDrawing.current = false;
    lastPos.current = null;
  }, []);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
  }, []);

  const getImageData = useCallback((): ImageData | null => {
    const canvas = canvasRef.current;
    if (!canvas || !hasContent) return null;
    const ctx = canvas.getContext('2d')!;
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }, [hasContent]);

  // Initialize canvas with white background (once on mount)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Bindlisteners (stable - no dependencies on strokeWidth/strokeColor)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('pointerdown', startDrawing);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointerleave', stopDrawing);
    canvas.addEventListener('pointercancel', stopDrawing);

    const preventTouch = (e: TouchEvent) => e.preventDefault();
    canvas.addEventListener('touchstart', preventTouch, { passive: false });
    canvas.addEventListener('touchmove', preventTouch, { passive: false });

    return () => {
      canvas.removeEventListener('pointerdown', startDrawing);
      canvas.removeEventListener('pointermove', draw);
      canvas.removeEventListener('pointerup', stopDrawing);
      canvas.removeEventListener('pointerleave', stopDrawing);
      canvas.removeEventListener('pointercancel', stopDrawing);
      canvas.removeEventListener('touchstart', preventTouch);
      canvas.removeEventListener('touchmove', preventTouch);
    };
  }, [startDrawing, draw, stopDrawing]);

  return {
    canvasRef,
    hasContent,
    clear,
    getImageData,
  };
}
