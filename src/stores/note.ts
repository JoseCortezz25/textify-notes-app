import { create } from 'zustand';
import { Folder, Note } from '@/lib/types';

interface FolderStore {
  folders: Folder[];
  createFolder: (title: string) => void;
  updateNote: (folderId: string, noteId: string, title: string) => void;
  addNote: (folderId: string, note: Note) => void;
}

export const useNoteStore = create<FolderStore>((set) => ({
  folders: [],
  createFolder: (title: string) => set((state) => {
    const folderId = `folder-${Date.now().toString()}`;
    const noteId = `note-${Date.now().toString()}`;

    return {
      folders: [
        ...state.folders, 
        { 
          folderId, 
          name: title, 
          notes: [{
            noteId, 
            title: 'First Note',
            content: `<h1>Welcome to Notes. This ${title}'s note</h1><p>Start writing your note here...</p>`,
            createdAt: new Date().toISOString(),
            folderId
          }] as Note[],
          createdAt: new Date().toISOString()
        }]
    };
  }),
  updateNote: (folderId: string, noteId: string, title: string) => 
    set(({ folders }) => {
      const folderIndex = folders.findIndex(folder => folder.folderId === folderId);
      if (folderIndex === -1) return { folders };

      const noteIndex = folders[folderIndex].notes.findIndex(note => note.noteId === noteId);
      if (noteIndex === -1) return { folders };

      const updatedNote = { ...folders[folderIndex].notes[noteIndex], title };
      const updatedFolders = [...folders];
      updatedFolders[folderIndex].notes[noteIndex] = updatedNote;

      return { folders: updatedFolders };
    }),
    addNote: (folderId: string, note: Note) => set(({ folders }) => ({
      folders: folders.map(folder => {
        if (folder.folderId === folderId) {
          return { ...folder, notes: [...folder.notes, note] };
        }
        return folder;
      })
    })),
    deleteNote: (folderId: string, noteId: string) => set(({ folders }) => ({
      folders: folders.map(folder => {
        if (folder.folderId === folderId) {
          return { ...folder, notes: folder.notes.filter(note => note.noteId !== noteId) };
        }
        return folder;
      })
    }))
}));