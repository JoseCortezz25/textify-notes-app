"use client";

import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Heading2, HighlighterIcon, Sparkles, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

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

      // Get coordinates of the selection
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);

      const selectionCenter = {
        top: start.top,
        left: (start.left + end.left) / 2
      };

      // Position the toolbar above the selection
      setPosition({
        top: selectionCenter.top - 50, // Position above selection
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

    // Update toolbar position when selection changes
    const handleSelectionUpdate = () => {
      updateToolbarPosition();
    };

    // Update toolbar position when window is resized
    const handleWindowResize = () => {
      if (isVisible) updateToolbarPosition();
    };

    // Listen for selection changes
    editor.on('selectionUpdate', handleSelectionUpdate);
    window.addEventListener('resize', handleWindowResize);
    document.addEventListener('scroll', handleWindowResize);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      window.removeEventListener('resize', handleWindowResize);
      document.removeEventListener('scroll', handleWindowResize);
    };
  }, [editor, isVisible, updateToolbarPosition]);

  // Handle AI action
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
      className="fixed z-50 bg-white dark:bg-gray-800 shadow-md px-[9px] py-[6px] rounded-[12px] flex items-center gap-2 border border-gray-200 dark:border-gray-700"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-[calc(12px_/_2)]",
          { "bg-gray-200 dark:bg-gray-600": editor.isActive('bold') }
        )}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
          { "bg-gray-200 dark:bg-gray-600": editor.isActive('italic') }
        )}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn(
          "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
          { "bg-gray-200 dark:bg-gray-600": editor.isActive('underline') }
        )}
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={cn(
          "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
          { "bg-gray-200 dark:bg-gray-600": editor.isActive('highlight') }
        )}
        title="Highlight"
      >
        <HighlighterIcon className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
          { "bg-gray-200 dark:bg-gray-600": editor.isActive('heading', { level: 2 }) }
        )}
        title="Heading"
      >
        <Heading2 className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
          { "bg-gray-200 dark:bg-gray-600": editor.isActive('bulletList') }
        )}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
          { "bg-gray-200 dark:bg-gray-600": editor.isActive('orderedList') }
        )}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={cn(
          "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
          { "bg-gray-200 dark:bg-gray-600": editor.isActive('taskList') }
        )}
        title="Task List"
      >
        <ListTodo className="h-4 w-4" />
      </button>

      {/* AI Button */}
      <button
        onClick={handleAiClick}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ml-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
        title="AI Actions"
      >
        <Sparkles className="h-4 w-4" />
      </button>
    </div>
  );
};