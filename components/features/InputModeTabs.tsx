'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, PenTool } from 'lucide-react';
import { InputMode } from '@/types';

interface InputModeTabsProps {
  value: InputMode;
  onChange: (mode: InputMode) => void;
}

export function InputModeTabs({ value, onChange }: InputModeTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as InputMode)}>
      <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
        <TabsTrigger value="upload" className="gap-2">
          <Upload className="w-4 h-4" />
          Upload Image
          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
            Recommended
          </span>
        </TabsTrigger>
        <TabsTrigger value="canvas" className="gap-2">
          <PenTool className="w-4 h-4" />
          Write Online
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
