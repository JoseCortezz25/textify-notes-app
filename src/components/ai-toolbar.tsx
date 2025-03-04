"use client";

import { useState } from 'react';
import { Loader2, PenToolIcon, Wand2 } from "lucide-react";
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
  instruction: string;
}

interface AiToolbarProps {
  onApply: (options: AiOptions) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
}

export const AiToolbar = ({ onApply, open, onOpenChange, loading }: AiToolbarProps) => {
  const [creativity, setCreativity] = useState<CreativityLevel>('medium');
  const [tone, setTone] = useState<ToneType>('professional');
  const [instruction, setInstruction] = useState<string>('');

  const handleApply = () => {
    onApply({
      creativity,
      tone,
      instruction
    });
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
          <div className="relative">
            <PenToolIcon className="size-5 absolute top-4 left-4 text-main-blue dark:text-blue-700" />
            <input
              placeholder="Describe your change"
              className="writing-tools__input"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            />
          </div>

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
            disabled={loading}
          >
            <Wand2 className="h-4 w-4" />
            <span>Improve Writing</span>
            {loading && <Loader2 className="h-4 w-4 loader-animation" />}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};