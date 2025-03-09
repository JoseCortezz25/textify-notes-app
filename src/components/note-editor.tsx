"use client";

import { useEditor, EditorContent, Editor, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import UnderlineExtension from "@tiptap/extension-underline";
import { Note } from "@/lib/types";
import { cn, debounce } from "@/lib/utils";
import { useNoteStore } from "@/stores/note";
import { useEffect, useRef, useState } from 'react';
import { FloatingToolbar } from "./floating-toolbar";
import { Bold, Heading1, Heading2, Heading3, HighlighterIcon, Italic, List, ListOrdered, ListTodo, Underline } from "lucide-react";
import { Separator } from "./ui/separator";

export const NoteEditor = ({ note }: { note: Note }) => {
  const { updateNoteContent } = useNoteStore();
  const editorRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      {editor && <FloatingToolbar editor={editor} />}
      <div ref={editorRef} className="flex-1 overflow-y-auto  editor-text__content">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
};