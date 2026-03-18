'use client';

import { useState, useCallback, useRef } from 'react';
import { InputModeTabs } from '@/components/features/InputModeTabs';
import { WritingGrid } from '@/components/features/WritingGrid';
import { ImageUploader } from '@/components/features/ImageUploader';
import { ImageCropper } from '@/components/features/ImageCropper';
import { FontPreview } from '@/components/features/FontPreview';
import { DownloadButton } from '@/components/features/DownloadButton';
import { InputMode, CharacterCropResult, DEFAULT_FONT_CONFIG, LETTERS } from '@/types';
import {
  generateFont,
  generateFreePreviewFont,
  createGlyphDataFromCanvas,
  createGlyphDataFromUpload,
  createFontPreviewUrl,
} from '@/lib/font-engine';
import { preprocessImage } from '@/lib/ai-preprocess';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { RotateCcw, AlertCircle } from 'lucide-react';

type UploadStep = 'upload' | 'cropping' | 'ready';

export default function CreatePage() {
  // Mode state
  const [mode, setMode] = useState<InputMode>('upload');

  // Canvas mode state
  const [canvasCompletedCount, setCanvasCompletedCount] = useState(0);
  const canvasDataGetterRef = useRef<(() => Map<string, ImageData>) | null>(null);

  // Upload mode state
  const [uploadStep, setUploadStep] = useState<UploadStep>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropResults, setCropResults] = useState<CharacterCropResult[] | null>(null);
  const [cropMethod, setCropMethod] = useState<'ai' | 'fallback'>('fallback');

  // Font generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingProgress, setGeneratingProgress] = useState('');
  const [fontBuffer, setFontBuffer] = useState<ArrayBuffer | null>(null);
  const [freePreviewBuffer, setFreePreviewBuffer] = useState<ArrayBuffer | null>(null);
  const [fontPreviewUrl, setFontPreviewUrl] = useState<string | null>(null);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Handle image upload
  const handleImageLoaded = useCallback(async (file: File, imageData: ImageData) => {
    setIsProcessing(true);
    setFontBuffer(null);
    setFreePreviewBuffer(null);
    setFontPreviewUrl(null);
    setError(null);

    try {
      const { results, method } = await preprocessImage(file, imageData);
      setCropResults(results);
      setCropMethod(method);
      setUploadStep('cropping');
    } catch (err) {
      console.error('Processing failed:', err);
      setError('Failed to process the image. Please try a clearer photo with dark ink on white paper.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Handle crop confirmation
  const handleCropConfirm = useCallback(async (results: CharacterCropResult[]) => {
    setCropResults(results);
    setUploadStep('ready');
    setError(null);

    // Auto-generate font
    setIsGenerating(true);
    setGeneratingProgress('Preparing...');
    try {
      const croppedImages = LETTERS.map((letter) => {
        const found = results.find((r) => r.letter === letter && r.qualityScore > 0);
        return found?.imageData || null;
      });

      const glyphData = createGlyphDataFromUpload(croppedImages);

      // Generate full font
      const { buffer } = await generateFont(glyphData, DEFAULT_FONT_CONFIG, (current, total, letter) => {
        setGeneratingProgress(`Processing ${letter}... (${current}/${total})`);
      });
      setFontBuffer(buffer);
      setFontPreviewUrl(createFontPreviewUrl(buffer));

      // Generate free preview (A-Z only)
      const { buffer: freeBuffer } = await generateFreePreviewFont(glyphData, DEFAULT_FONT_CONFIG);
      setFreePreviewBuffer(freeBuffer);
    } catch (err) {
      console.error('Font generation failed:', err);
      setError('Font generation failed. Please try re-uploading your image.');
    } finally {
      setIsGenerating(false);
      setGeneratingProgress('');
    }
  }, []);

  // Handle canvas font generation
  const handleCanvasGenerate = useCallback(async () => {
    if (!canvasDataGetterRef.current) return;

    setIsGenerating(true);
    setGeneratingProgress('Preparing...');
    setError(null);
    try {
      const canvasData = canvasDataGetterRef.current();
      const glyphData = createGlyphDataFromCanvas(canvasData);

      // Generate full font
      const { buffer } = await generateFont(glyphData, DEFAULT_FONT_CONFIG, (current, total, letter) => {
        setGeneratingProgress(`Processing ${letter}... (${current}/${total})`);
      });
      setFontBuffer(buffer);
      setFontPreviewUrl(createFontPreviewUrl(buffer));

      // Generate free preview (A-Z only)
      const { buffer: freeBuffer } = await generateFreePreviewFont(glyphData, DEFAULT_FONT_CONFIG);
      setFreePreviewBuffer(freeBuffer);
    } catch (err) {
      console.error('Font generation failed:', err);
      setError('Font generation failed. Please try writing the letters again.');
    } finally {
      setIsGenerating(false);
      setGeneratingProgress('');
    }
  }, []);

  // Reset upload
  const handleRetry = useCallback(() => {
    setUploadStep('upload');
    setCropResults(null);
    setFontBuffer(null);
    setFreePreviewBuffer(null);
    setFontPreviewUrl(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Create Your Font
          </h1>
          <p className="text-muted-foreground mt-2">
            Write your letters, and we&apos;ll turn them into a real font file.
            Supports A-Z, a-z, 0-9, and punctuation.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 border border-destructive/50 bg-destructive/5 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Something went wrong</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto shrink-0" onClick={() => setError(null)}>
              Dismiss
            </Button>
          </div>
        )}

        {/* Mode tabs */}
        <div className="mb-8">
          <InputModeTabs
            value={mode}
            onChange={(m) => {
              setMode(m);
              setFontBuffer(null);
              setFreePreviewBuffer(null);
              setFontPreviewUrl(null);
              setError(null);
            }}
          />
        </div>

        {/* Upload mode */}
        {mode === 'upload' && (
          <div className="space-y-6">
            {uploadStep === 'upload' && (
              <ImageUploader
                onImageLoaded={handleImageLoaded}
                isProcessing={isProcessing}
              />
            )}

            {uploadStep === 'cropping' && cropResults && (
              <ImageCropper
                results={cropResults}
                method={cropMethod}
                onConfirm={handleCropConfirm}
                onRetry={handleRetry}
              />
            )}

            {uploadStep === 'ready' && (
              <div className="text-center">
                <Button variant="ghost" size="sm" onClick={handleRetry}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Upload a different image
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Canvas mode */}
        {mode === 'canvas' && (
          <div className="space-y-6">
            <WritingGrid
              onDataChange={setCanvasCompletedCount}
              getCanvasDataRef={(getter) => {
                canvasDataGetterRef.current = getter;
              }}
            />

            {/* Generate button for canvas mode */}
            <div className="flex justify-center">
              <DownloadButton
                fontBuffer={fontBuffer}
                freePreviewBuffer={freePreviewBuffer}
                isGenerating={isGenerating}
                generatingProgress={generatingProgress}
                onGenerate={handleCanvasGenerate}
                disabled={canvasCompletedCount === 0}
              />
            </div>
          </div>
        )}

        {/* Preview section (shown when font is generated) */}
        {fontPreviewUrl && (
          <>
            <Separator className="my-8" />
            <FontPreview
              fontUrl={fontPreviewUrl}
              fontFamily={DEFAULT_FONT_CONFIG.familyName}
            />

            {/* Download for upload mode */}
            {mode === 'upload' && (
              <div className="flex justify-center mt-6">
                <DownloadButton
                  fontBuffer={fontBuffer}
                  freePreviewBuffer={freePreviewBuffer}
                  isGenerating={isGenerating}
                  generatingProgress={generatingProgress}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
