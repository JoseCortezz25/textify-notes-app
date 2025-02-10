"use client";

import { Navbar } from "@/components/layout/navbar";
import Image from 'next/image';
import { NoteEditor } from "@/components/note-editor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor";
import { useNoteStore } from "@/stores/note";

export default function Home() {
  const { currentNote } = useEditorStore();
  const { createFolder } = useNoteStore();

  return (
    <main className="w-full flex flex-col h-screen">
      <Navbar />

      <div className={cn(!currentNote && "w-full h-full flex justify-center items-center")}>
        {currentNote
          ? <NoteEditor note={currentNote} />
          : (
            <section className="px-4 flex flex-col items-center">
              <div className="items-center gap-4 mb-6">
                <Image
                  src="/documents-dark.png"
                  className="hidden dark:block w-full h-full"
                  alt=""
                  width={500}
                  height={500}
                />
                <Image
                  src="/documents.png"
                  className="block dark:hidden w-full h-full"
                  alt=""
                  width={500}
                  height={500}
                />
              </div>

              <h2 className="text-2xl font-bold mb-2 text-center">Create a New Note</h2>
              <p className="text-lg mb-6 text-center">Click the button below to start creating your note.</p>
              <Button
                onClick={() => createFolder("New Folder")}
                className="mx-auto bg-main-navy text-main-white dark:bg-main-white dark:text-main-navy font-bold rounded-full px-7"
              >
                Create Note
              </Button>
            </section>
          )}
      </div>
    </main>
  );
}
