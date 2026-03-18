'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, Loader2 } from 'lucide-react';
import { PaywallDialog } from './PaywallDialog';

interface DownloadButtonProps {
  fontBuffer: ArrayBuffer | null;
  freePreviewBuffer: ArrayBuffer | null;
  isGenerating?: boolean;
  generatingProgress?: string;
  onGenerate?: () => Promise<void>;
  disabled?: boolean;
}

export function DownloadButton({
  fontBuffer,
  freePreviewBuffer,
  isGenerating,
  generatingProgress,
  onGenerate,
  disabled,
}: DownloadButtonProps) {
  const [showPaywall, setShowPaywall] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [fontName, setFontName] = useState('MyHandwriting');

  const handleClick = async () => {
    if (!fontBuffer && onGenerate) {
      await onGenerate();
    }
    setShowPaywall(true);
  };

  const handleFreePreview = () => {
    setShowPaywall(false);
    if (freePreviewBuffer) {
      setShowNameDialog(true);
    }
  };

  const handleDownload = () => {
    // Free preview: only download the A-Z uppercase limited buffer
    const buffer = freePreviewBuffer;
    if (!buffer) return;

    const blob = new Blob([buffer], { type: 'font/otf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fontName || 'MyHandwriting'}_preview.otf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowNameDialog(false);
  };

  return (
    <>
      <Button
        size="lg"
        onClick={handleClick}
        disabled={disabled || isGenerating}
        className="gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {generatingProgress || 'Generating Font...'}
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            {fontBuffer ? 'Download Font (.otf)' : 'Generate & Download'}
          </>
        )}
      </Button>

      {/* Paywall dialog */}
      <PaywallDialog
        open={showPaywall}
        onOpenChange={setShowPaywall}
        onFreePreview={handleFreePreview}
        fontBuffer={fontBuffer}
      />

      {/* Font naming dialog (free preview) */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Download Free Preview</DialogTitle>
            <DialogDescription>
              This free preview includes A-Z uppercase only (26 characters). Upgrade for the full character set with lowercase, numbers, and punctuation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label htmlFor="font-name" className="text-sm font-medium">
              Font Name
            </label>
            <input
              id="font-name"
              value={fontName}
              onChange={(e) => setFontName(e.target.value)}
              placeholder="MyHandwriting"
              className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download .otf (A-Z Preview)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
