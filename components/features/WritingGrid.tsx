'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { WritingCanvas } from './WritingCanvas';
import { CHARACTER_GROUPS, ALL_CHARACTERS, GRID_COLS, CharGroupKey } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eraser } from 'lucide-react';

interface WritingGridProps {
  onDataChange?: (completedCount: number) => void;
  getCanvasDataRef?: (getter: () => Map<string, ImageData>) => void;
}

export function WritingGrid({ onDataChange, getCanvasDataRef }: WritingGridProps) {
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [activeTab, setActiveTab] = useState<CharGroupKey>('uppercase');
  const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set());
  const [resetKey, setResetKey] = useState(0);
  const imageDataGetters = useRef<Map<string, () => ImageData | null>>(new Map());

  const activeGroup = CHARACTER_GROUPS.find((g) => g.key === activeTab)!;

  // Store onDataChange in a ref to avoid dependency in the callback
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;

  const handleContentChange = useCallback(
    (letter: string, hasContent: boolean) => {
      setCompletedLetters((prev) => {
        const next = new Set(prev);
        if (hasContent) {
          next.add(letter);
        } else {
          next.delete(letter);
        }
        return next;
      });
    },
    []
  );

  // Notify parent of count changes via useEffect (not during state updater)
  useEffect(() => {
    onDataChangeRef.current?.(completedLetters.size);
  }, [completedLetters.size]);

  const registerGetter = useCallback(
    (letter: string) => (getter: () => ImageData | null) => {
      imageDataGetters.current.set(letter, getter);
    },
    []
  );

  const getAllCanvasData = useCallback((): Map<string, ImageData> => {
    const result = new Map<string, ImageData>();
    for (const [letter, getter] of imageDataGetters.current) {
      const data = getter();
      if (data) {
        result.set(letter, data);
      }
    }
    return result;
  }, []);

  const getCanvasDataRefStable = useRef(getCanvasDataRef);
  getCanvasDataRefStable.current = getCanvasDataRef;

  useEffect(() => {
    getCanvasDataRefStable.current?.(getAllCanvasData);
  }, [getAllCanvasData]);

  const handleClearAll = useCallback(() => {
    imageDataGetters.current.clear();
    setCompletedLetters(new Set());
    setResetKey((k) => k + 1);
  }, []);

  return (
    <div className="space-y-4">
      {/* Character group tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        {CHARACTER_GROUPS.map((group) => {
          const groupCompleted = group.chars.filter((c) => completedLetters.has(c)).length;
          return (
            <button
              key={group.key}
              onClick={() => setActiveTab(group.key)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === group.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {group.label}
              {groupCompleted > 0 && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  {groupCompleted}/{group.chars.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Stroke Width:
          </span>
          <Select
            value={String(strokeWidth)}
            onValueChange={(v) => setStrokeWidth(Number(v))}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 8, 10].map((w) => (
                <SelectItem key={w} value={String(w)}>
                  {w}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {completedLetters.size}/{ALL_CHARACTERS.length} total
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
          >
            <Eraser className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Grid for active tab */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
        }}
      >
        {activeGroup.chars.map((letter) => (
          <WritingCanvas
            key={`${letter}-${resetKey}`}
            letter={letter}
            strokeWidth={strokeWidth}
            onContentChange={handleContentChange}
            getImageDataRef={registerGetter(letter)}
          />
        ))}
      </div>
    </div>
  );
}
