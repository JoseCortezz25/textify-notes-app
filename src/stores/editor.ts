import { create } from 'zustand';
import { Folder, Note } from '@/lib/types';

interface EditorStore {
  currentNote: Note | null;
  currentFolder: Folder | null;
  setCurrentNote: (note: Note) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  currentNote: null,
  currentFolder: null,
  setCurrentNote: (note: Note) => {
    set({ currentNote: note });
  },
  clearCurrentNote: () => {
    set({ currentNote: null });
  },
  setCurrentFolder: (folder: Folder) => {
    set({ currentFolder: folder });
  }
}));