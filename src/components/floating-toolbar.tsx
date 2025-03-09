"use client";

import { BubbleMenu, Editor } from '@tiptap/react';
import { useCallback, useEffect, useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  HighlighterIcon,
  ListTodo,
  PenTool,
  Heading1,
  Heading2,
  Heading3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from './ui/separator';
import { AiToolbar, AiOptions } from './ai-toolbar';
import { improveWriting } from '@/actions/writer';

type FloatingToolbarProps = {
  editor: Editor;
};

export const FloatingToolbar = ({ editor }: FloatingToolbarProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: -9999, left: -9999 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAiToolbar, setShowAiToolbar] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectionLength, setSelectionLength] = useState(0);

  useEffect(() => {
    const MOBILE_BREAKPOINT = 768;
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkIfMobile();

    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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
          // updateToolbarPosition();
        }, 0);
      }
    }
  };

  const ToolbarButtons = ({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return (
        <div className='toolbar'>
          <div className='flex space-x-2 items-center'>
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
          </div>
        </div>
      );
    }

    return (
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        className="toolbar toolbar--floating flex space-x-2 items-center"
      >
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

        <AIButton isMobile={isMobile} />
      </BubbleMenu>
    )
  };

  const AIButton = ({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-black-pearl-50 dark:bg-gray-900 rounded-full py-3 px-6 border border-blue-500/50 dark:border-gray-700"
        >

          <button className="flex gap-2 items-center justify-center text-blue-500" onClick={() => setShowAiToolbar(prev => !prev)}>
            <PenTool className="size-5" /> Edit with AI
          </button>
        </BubbleMenu>
      );
    };

    return (
      <>
        <Separator orientation="vertical" className="h-[25px] dark:bg-gray-800" />
        <button className="toolbar__item--ai" onClick={() => setShowAiToolbar(prev => !prev)}>
          <span className="text-sm">Improve with AI</span>
          <PenTool className="toolbar__item-icon" />
        </button>
      </>
    );
  };

  return (
    <>
      <div
      // ref={toolbarRef}
      // className={isMobile ? "toolbar" : "toolbar toolbar--floating"}
      // style={
      //   !isMobile ? {
      //     top: `${position.top}px`,
      //     left: `${position.left}px`
      //   } : undefined
      // }
      >
        <div className="flex space-x-2 items-center">
          <ToolbarButtons isMobile={isMobile} />
          <AIButton isMobile={isMobile} />
          {/* {!isMobile && shouldShowAiFeatures && AIButton(false)} */}
        </div>
      </div>

      <AiToolbar
        open={showAiToolbar}
        onOpenChange={setShowAiToolbar}
        onApply={handleAiApply}
        loading={loading}
      />
    </>
  );
};