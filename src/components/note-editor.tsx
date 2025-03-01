"use client";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Bold, Italic, Underline, List, ListOrdered, Heading, HighlighterIcon, ListTodo } from "lucide-react";
import UnderlineExtension from "@tiptap/extension-underline";
import { Note } from "@/lib/types";
import { cn, debounce } from "@/lib/utils";
import { useNoteStore } from "@/stores/note";
import { useEffect, useRef, useState, useCallback } from 'react';
import { FloatingToolbar } from "./floating-toolbar";

export const NoteEditor = ({ note }: { note: Note }) => {
  const { updateNoteContent } = useNoteStore();
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState<string>("");

  const editor = useEditor({
    extensions: [StarterKit, Highlight, TaskList, TaskItem, UnderlineExtension],
    content: note.content,
    editorProps: {
      attributes: {
        class: "editor-content prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none"
      }
    },
    onUpdate: debounce((args) => {
      const { editor } = args as { editor: Editor };
      const content = editor.getHTML();
      updateNoteContent(note.folderId, note.noteId, content);
    }, 500)
  });

  // Handler for AI actions on selected text
  const handleAiAction = useCallback((text: string) => {
    setSelectedText(text);
    // Here you can add any AI-related actions, like showing a modal
    console.log("AI action triggered with text:", text);
    // You could open a modal here, or trigger an API call
  }, []);

  // Update content when the note changes
  useEffect(() => {
    if (editor && editor.getHTML() !== note.content) {
      editor.commands.setContent(note.content);
    }
  }, [note.content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="editor-text relative flex flex-col flex-1">
      {editor && <FloatingToolbar editor={editor} onAiAction={handleAiAction} />}
      {/* <div className="flex items-center border-b p-2 dark:border-neutral-800">
        <div className="flex space-x-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
              { "bg-gray-200 dark:bg-gray-700": editor.isActive('bold') }
            )}
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
              { "bg-gray-200 dark:bg-gray-700": editor.isActive('italic') }
            )}
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
              { "bg-gray-200 dark:bg-gray-700": editor.isActive('underline') }
            )}
          >
            <Underline className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
              { "bg-gray-200 dark:bg-gray-700": editor.isActive('heading', { level: 2 }) }
            )}
          >
            <Heading className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
              { "bg-gray-200 dark:bg-gray-700": editor.isActive('bulletList') }
            )}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
              { "bg-gray-200 dark:bg-gray-700": editor.isActive('orderedList') }
            )}
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={cn(
              "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
              { "bg-gray-200 dark:bg-gray-700": editor.isActive('taskList') }
            )}
          >
            <ListTodo className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={cn(
              "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
              { "bg-gray-200 dark:bg-gray-700": editor.isActive('highlight') }
            )}
          >
            <HighlighterIcon className="h-4 w-4" />
          </button>
        </div>
      </div> */}
      <div ref={editorRef} className="flex-1 overflow-y-auto  editor-text__content">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
};