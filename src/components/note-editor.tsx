"use client";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, List, ListOrdered, Heading, HighlighterIcon, ListTodo } from "lucide-react";
import UnderlineExtension from "@tiptap/extension-underline";
import { Note } from "@/lib/types";
import { cn, debounce } from "@/lib/utils";
import { useNoteStore } from "@/stores/note";
import { useEffect } from 'react';

export const NoteEditor = ({ note }: { note: Note }) => {
  const { updateNoteContent } = useNoteStore();

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
    if (editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content);
    }
  }, [note.content, note.noteId, editor]);

  if (!editor) {
    return null;
  }

  return (
    <section className="editor-text flex-1 flex flex-col overflow-hidden">
      <div className="border-b p-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("editor-text__option", editor.isActive("bold") ? "bg-main-light-blue/30" : "")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("editor-text__option", editor.isActive("italic") && "bg-main-light-blue/30")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn("editor-text__option", editor.isActive("underline") && "bg-main-light-blue/30")}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn("editor-text__option", editor.isActive("heading", { level: 1 }) && "bg-muted")}
        >
          <Heading className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("editor-text__option", editor.isActive("bulletList") && "bg-muted")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("editor-text__option", editor.isActive("orderedList") && "bg-muted")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight({ color: '#00ff66' }).run()}
          className={`editor-text__option ${editor.isActive("highlight") ? "bg-muted" : ""}`}
        >
          <HighlighterIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`editor-text__option ${editor.isActive("taskList") ? "bg-muted" : ""}`}
        >
          <ListTodo className="h-4 w-4" />
        </Button>

      </div>
      <div className="flex-1 overflow-auto editor-text__content">
        <EditorContent editor={editor} />
      </div>
    </section>
  );
};