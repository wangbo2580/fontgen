'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Camera, FileImage, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onImageLoaded: (file: File, imageData: ImageData) => void;
  isProcessing?: boolean;
}

export function ImageUploader({ onImageLoaded, isProcessing }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MIN_DIMENSION = 500;
  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const processFile = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Please upload a JPG or PNG image.');
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError('File too large. Maximum size is 10MB.');
        return;
      }

      // Load image and validate dimensions
      try {
        const imageData = await loadImage(file);
        const minDim = Math.min(imageData.width, imageData.height);
        if (minDim < MIN_DIMENSION) {
          setError(
            `Image too small (${imageData.width}×${imageData.height}). Please use at least 1000×1000px.`
          );
          return;
        }
        onImageLoaded(file, imageData);
      } catch {
        setError('Failed to load image. Please try another file.');
      }
    },
    [onImageLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="space-y-4">
      {/* Template download */}
      <div className="bg-muted/50 rounded-lg p-4 border border-dashed border-border">
        <div className="flex items-start gap-3">
          <FileImage className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">Step 1: Download Template</p>
            <p className="text-xs text-muted-foreground mt-1">
              Print the template, write A-Z in each cell with your favorite pen, then take a photo.
            </p>
            <Button variant="link" size="sm" className="px-0 h-auto mt-1" asChild>
              <a href="/template.svg" download="handwriting-template.svg">
                Download Template (SVG, printable) →
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Upload area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-medium">AI is analyzing your handwriting...</p>
            <p className="text-xs text-muted-foreground">This usually takes a few seconds</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4 cursor-pointer">
            <Upload className="w-10 h-10 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                Drop image here, or click to select
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG / PNG, max 10MB
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Camera className="w-3.5 h-3.5" />
              <span>On mobile, you can take a photo directly</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

function loadImage(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        resolve(ctx.getImageData(0, 0, img.width, img.height));
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}
