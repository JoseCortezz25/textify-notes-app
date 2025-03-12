"use client";

import { useEditor, EditorContent, Editor, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import UnderlineExtension from "@tiptap/extension-underline";
import { Note } from "@/lib/types";
import { debounce } from "@/lib/utils";
import { useNoteStore } from "@/stores/note";
import { useCallback, useEffect, useRef, useState } from 'react';
import { FloatingToolbar } from "./floating-toolbar";
import { AiOptions, AiToolbar } from "./ai-toolbar";
import { improveWriting } from "@/actions/writer";

export const NoteEditor = ({ note }: { note: Note }) => {
  const { updateNoteContent } = useNoteStore();
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [showAiToolbar, setShowAiToolbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateSelectedText = useCallback((editor: Editor) => {
    if (!editor.state.selection.empty) {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, ' ');
      setSelectedText(text);
      return;
    }

    setSelectedText("");
  }, []);

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
    }, 500),
    onSelectionUpdate: ({ editor }) => {
      updateSelectedText(editor);
    }
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== note.content) {
      editor.commands.setContent(note.content);
    }
  }, [note.content, editor]);

  const handleAiApply = (options: AiOptions) => {
    if (editor && !editor.state.selection.empty) {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, ' ');

      const { instruction, creativity, tone } = options;

      const formData = new FormData();
      formData.append('instruction', instruction);
      formData.append('creativity', creativity);
      formData.append('tone', tone);
      formData.append('selectedText', selectedText);
      const fullText = editor.getText();
      const formatedText = fullText.replace(/\n/g, ' ');
      formData.append('fullText', formatedText);

      if (selectedText) {
        setLoading(true);
        improveWriting(formData)
          .then((result) => {
            editor.chain().focus().insertContent(result).run();
          })
          .catch((error) => {
            console.error('AI ERROR', error);
          })
          .finally(() => {
            setLoading(false);
            setShowAiToolbar(false);
          });

        setTimeout(() => {
          editor.commands.focus();
        }, 0);
      }
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="editor-text relative flex flex-col flex-1">
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{
            duration: 100
          }}
        >
          <FloatingToolbar
            editor={editor}
            onOpenAIToolbar={() => setShowAiToolbar(prev => !prev)}
            selectedText={selectedText}
          />
        </BubbleMenu>
      )}

      <div ref={editorRef} className="flex-1 overflow-y-auto editor-text__content">
        <EditorContent editor={editor} className="h-full" />
      </div>

      <AiToolbar
        open={showAiToolbar}
        onOpenChange={setShowAiToolbar}
        onApply={handleAiApply}
        loading={loading}
      />
    </div>
  );
};