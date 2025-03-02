"use client";

import { useState } from 'react';
import { Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { CreativityLevel, ToneType } from '@/lib/types';
import { CREATIVITY_LEVELS, TONE_TYPES } from '@/lib/contants';
import { Button } from './ui/button';

export interface AiOptions {
  creativity: CreativityLevel;
  tone: ToneType;
}

interface AiToolbarProps {
  onApply: (options: AiOptions) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AiToolbar = ({ onApply, open, onOpenChange }: AiToolbarProps) => {
  const [creativity, setCreativity] = useState<CreativityLevel>('medium');
  const [tone, setTone] = useState<ToneType>('professional');

  const handleApply = () => {
    onApply({ creativity, tone });
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="w-full mx-auto rounded-t-[20px] dark:text-black-pearl-50 dark:bg-black-pearl-950 dark:border-black-pearl-900">
        <SheetHeader className="md:max-w-[600px] mx-auto">
          <SheetTitle className="text-[22px] font-semibold">Writing Tools</SheetTitle>
          <SheetDescription className="text-[14px] text-gray-500 dark:text-gray-400 !-mt-0.5">
            Enhance your text using AI assistance
          </SheetDescription>
        </SheetHeader>

        <div className="writing-tools">
          <div>
            <label className="writing-tools__label">Creativity Level</label>
            <div className="flex gap-2">
              {CREATIVITY_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setCreativity(level)}
                  className={cn("option-btn", creativity === level && "option-btn--selected")}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="writing-tools__label">Tone</label>
            <div className="grid grid-cols-2 gap-2">
              {TONE_TYPES.map((toneOption) => (
                <button
                  key={toneOption}
                  onClick={() => setTone(toneOption)}
                  className={cn("option-btn", tone === toneOption && "option-btn--selected")}
                >
                  {toneOption}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleApply}
            variant="submit"
            className="mt-6"
          >
            <Wand2 className="h-4 w-4" />
            <span>Improve Writing</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};