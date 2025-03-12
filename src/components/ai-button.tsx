"use client";

import { PenTool } from "lucide-react";
import { Separator } from "./ui/separator";

interface AIButtonProps {
  onOpenAIToolbar: () => void;
  selectedText: string;
}

export const AIButton = ({ onOpenAIToolbar, selectedText }: AIButtonProps) => {
  if (selectedText.length < 40) return;

  return (
    <>
      <Separator orientation="vertical" className="h-[25px] dark:bg-gray-800" />
      <button className="toolbar__item--ai" onClick={onOpenAIToolbar}>
        <span className="text-sm">Improve with AI</span>
        <PenTool className="toolbar__item-icon" />
      </button>
    </>
  );
};