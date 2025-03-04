"use client";

import { Editor } from '@tiptap/react';
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

  const updateToolbarPosition = useCallback(() => {
    if (!editor) return;

    const hasTextSelection = !editor.state.selection.empty;
    setHasSelection(hasTextSelection);

    if (hasTextSelection) {
      const { view } = editor;
      const { from, to } = editor.state.selection;

      const selectedText = editor.state.doc.textBetween(from, to, ' ');
      setSelectionLength(selectedText.length);

      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);

      const selectionCenter = {
        top: start.top,
        left: (start.left + end.left) / 2
      };

      setPosition({
        top: selectionCenter.top - (isMobile ? 30 : 60),
        left: Math.max(10, Math.min(selectionCenter.left - (isMobile ? 40 : 150),
          document.body.clientWidth - (isMobile ? 80 : 300)))
      });

      setIsVisible(true);
    } else {
      setSelectionLength(0);
      setIsVisible(isMobile);
    }
  }, [editor, isMobile]);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      updateToolbarPosition();
    };

    const handleWindowResize = () => {
      if (isVisible) updateToolbarPosition();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (!isMobile && toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        if (editor.state.selection.empty) {
          setIsVisible(false);
        }
      }
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    window.addEventListener('resize', handleWindowResize);
    document.addEventListener('scroll', handleWindowResize);
    document.addEventListener('mousedown', handleClickOutside);

    if (isMobile) {
      setIsVisible(true);
    }

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      window.removeEventListener('resize', handleWindowResize);
      document.removeEventListener('scroll', handleWindowResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editor, isVisible, updateToolbarPosition, isMobile]);


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
          updateToolbarPosition();
        }, 0);
      }
    }
  };

  const renderToolbarButtons = () => (
    <>
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
    </>
  );

  const renderAiButton = (isMobileDevice: boolean) => {
    if (isMobileDevice) {
      return (
        <div
          className="writing-tools-selection-btn"
          onClick={() => setShowAiToolbar(prev => !prev)}
          style={{
            top: `${position.top - 30}px`,
            left: `${position.left}px`
          }}
        >
          <PenTool className="h-4 w-4" />
        </div>
      );
    }

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

  const shouldShowAiFeatures = selectionLength >= 50;

  if (!isVisible && !hasSelection) return null;

  return (
    <>
      <div
        ref={toolbarRef}
        className={isMobile ? "toolbar" : "toolbar toolbar--floating"}
        style={
          !isMobile ? {
            top: `${position.top}px`,
            left: `${position.left}px`
          } : undefined
        }
      >
        <div className="flex space-x-2 items-center">
          {renderToolbarButtons()}
          {!isMobile && shouldShowAiFeatures && renderAiButton(false)}
        </div>
      </div>

      {isMobile && shouldShowAiFeatures && renderAiButton(true)}

      <AiToolbar
        open={showAiToolbar && shouldShowAiFeatures}
        onOpenChange={setShowAiToolbar}
        onApply={handleAiApply}
        loading={loading}
      />
    </>
  );
};