"use client";

import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Heading2, HighlighterIcon, Sparkles, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from './ui/separator';

type FloatingToolbarProps = {
  editor: Editor;
  onAiAction?: (selectedText: string) => void;
};

export const FloatingToolbar = ({ editor, onAiAction }: FloatingToolbarProps) => {
  const [position, setPosition] = useState({ top: -9999, left: -9999 });
  const [isVisible, setIsVisible] = useState(false);

  const updateToolbarPosition = useCallback(() => {
    if (!editor.state.selection.empty) {
      const { view } = editor;
      const { from, to } = editor.state.selection;

      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);

      const selectionCenter = {
        top: start.top,
        left: (start.left + end.left) / 2
      };

      setPosition({
        top: selectionCenter.top - 50,
        left: Math.max(10, Math.min(selectionCenter.left - 150,
          document.body.clientWidth - 300)) // Keep within viewport
      });

      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      updateToolbarPosition();
    };

    const handleWindowResize = () => {
      if (isVisible) updateToolbarPosition();
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    window.addEventListener('resize', handleWindowResize);
    document.addEventListener('scroll', handleWindowResize);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      window.removeEventListener('resize', handleWindowResize);
      document.removeEventListener('scroll', handleWindowResize);
    };
  }, [editor, isVisible, updateToolbarPosition]);

  const handleAiClick = () => {
    if (editor && !editor.state.selection.empty) {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, ' ');
      if (onAiAction && selectedText) {
        onAiAction(selectedText);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="toolbar"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn("toolbar__item", editor.isActive('bold') && "bg-periwinkle/50 text-black-pearl-900 dark:bg-gray-600")}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn("toolbar__item", editor.isActive('italic') && "bg-periwinkle/50 text-black-pearl-900 dark:bg-gray-600")}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn("toolbar__item", editor.isActive('underline') && "bg-periwinkle/50 text-black-pearl-900 dark:bg-gray-600")}
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </button>

      <Separator orientation="vertical" className="h-[25px]" />

      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={cn("toolbar__item", editor.isActive('highlight') && "bg-periwinkle/50 text-black-pearl-900 dark:bg-gray-600")}
        title="Highlight"
      >
        <HighlighterIcon className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn("toolbar__item", editor.isActive('heading', { level: 2 }) && "bg-periwinkle/50 text-black-pearl-900 dark:bg-gray-600")}
        title="Heading"
      >
        <Heading2 className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn("toolbar__item", editor.isActive('bulletList') && "bg-periwinkle/50 text-black-pearl-900 dark:bg-gray-600")}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn("toolbar__item", editor.isActive('orderedList') && "bg-periwinkle/50 text-black-pearl-900 dark:bg-gray-600")}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={cn("toolbar__item", editor.isActive('taskList') && "bg-periwinkle/50 text-black-pearl-900 dark:bg-gray-600")}
        title="Task List"
      >
        <ListTodo className="h-4 w-4" />
      </button>

      <Separator orientation="vertical" className="h-[25px]" />

      {/* AI Button */}
      <button
        onClick={handleAiClick}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ml-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
        title="AI Actions"
      >
        <Sparkles className="h-4 w-4" />
      </button>
    </div>
  );
};