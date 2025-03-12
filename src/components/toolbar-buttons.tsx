"use client";
import { cn } from "@/lib/utils";
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  HighlighterIcon,
  ListTodo,
  Heading1,
  Heading2,
  Heading3
} from "lucide-react";
import { Separator } from "./ui/separator";
import { AIButton } from "./ai-button";

interface ToolbarButtonsProps {
  editor: Editor;
  onOpenAIToolbar: () => void;
  selectedText?: string;
}

export const ToolbarButtons = ({ editor, onOpenAIToolbar, selectedText }: ToolbarButtonsProps) => {
  return (
    <div className={cn("toolbar flex space-x-2 items-center")}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn("toolbar__item", editor.isActive('bold') && "toolbar__item--active")}
        title="Bold"
      >
        <Bold className="toolbar__item-icon" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn("toolbar__item", editor.isActive('italic') && "toolbar__item--active")}
        title="Italic"
      >
        <Italic className="toolbar__item-icon" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn("toolbar__item", editor.isActive('underline') && "toolbar__item--active")}
        title="Underline"
      >
        <Underline className="toolbar__item-icon" />
      </button>

      <Separator orientation="vertical" className="h-[25px] dark:bg-gray-800" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn("toolbar__item", editor.isActive('heading', { level: 1 }) && "toolbar__item--active")}
        title="Heading"
      >
        <Heading1 className="toolbar__item-icon" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn("toolbar__item", editor.isActive('heading', { level: 2 }) && "toolbar__item--active")}
        title="Heading"
      >
        <Heading2 className="toolbar__item-icon" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn("toolbar__item", editor.isActive('heading', { level: 3 }) && "toolbar__item--active")}
        title="Heading"
      >
        <Heading3 className="toolbar__item-icon" />
      </button>

      <Separator orientation="vertical" className="h-[25px] dark:bg-gray-800" />

      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={cn("toolbar__item", editor.isActive('highlight') && "toolbar__item--active")}
        title="Highlight"
      >
        <HighlighterIcon className="toolbar__item-icon" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn("toolbar__item", editor.isActive('bulletList') && "toolbar__item--active")}
        title="Bullet List"
      >
        <List className="toolbar__item-icon" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn("toolbar__item", editor.isActive('orderedList') && "toolbar__item--active")}
        title="Ordered List"
      >
        <ListOrdered className="toolbar__item-icon" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={cn("toolbar__item", editor.isActive('taskList') && "toolbar__item--active")}
        title="Task List"
      >
        <ListTodo className="toolbar__item-icon" />
      </button>

      <AIButton
        onOpenAIToolbar={onOpenAIToolbar}
        selectedText={selectedText}
      />
    </div>
  );
};
