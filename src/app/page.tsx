"use client";

import { Navbar } from "@/components/layout/navbar";
import { NoteEditor } from "@/components/note-editor";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor";

export default function Home() {
  const { currentNote } = useEditorStore();

  return (
    <main className="w-full flex flex-col h-screen">
      <Navbar />

      <div className={cn(!currentNote && "w-full h-full flex justify-center items-center")}>
        {currentNote ? <NoteEditor note={currentNote} /> : <div className="flex  items-center justify-center">Select a note to start editing</div>}
      </div>
    </main>
  );
}
