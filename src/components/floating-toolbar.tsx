"use client";

import { Editor } from '@tiptap/react';
import { ToolbarButtons } from './toolbar-buttons';

type FloatingToolbarProps = {
  editor: Editor;
  onOpenAIToolbar: () => void;
  selectedText: string;
};

export const FloatingToolbar = ({ editor, onOpenAIToolbar, selectedText }: FloatingToolbarProps) => {
  return (
    <ToolbarButtons
      editor={editor}
      onOpenAIToolbar={onOpenAIToolbar}
      selectedText={selectedText}
    />
  );
};