import { create } from 'zustand';
import { Folder, Note } from '@/lib/types';
import Storage from '@/lib/storage';

interface FolderStore {
  folders: Folder[];
  loading: boolean;
  createFolder: (title: string) => Promise<Folder | undefined>;
  updateFolder: (folderId: string, name: string) => Promise<void>;
  updateNote: (folderId: string, noteId: string, title: string) => Promise<void>;
  addNote: (folderId: string, note: Note) => Promise<void>;
  deleteNote: (folderId: string, noteId: string) => Promise<void>;
  initializeFolders: () => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  updateNoteContent: (folderId: string, noteId: string, content: string) => Promise<void>;
  setFolders: (folders: Folder[]) => void;
}

export const useNoteStore = create<FolderStore>((set, get) => ({
  folders: [],
  loading: true,

  initializeFolders: async () => {
    try {
      const folders = await Storage.init();
      set({ folders, loading: false });
    } catch (error) {
      console.error('Failed to initialize folders:', error);
      set({ loading: false });
    }
  },

  setFolders: (folders: Folder[]) => {
    set({ folders, loading: false });
    Storage.saveFolders(folders).catch(err => 
      console.error('Failed to save folders:', err)
    );
  },

  createFolder: async (title: string) => {
    const newFolder: Folder = {
      folderId: `folder-${Date.now()}`,
      name: title,
      notes: [{
        noteId: `note-${Date.now()}`,
        title: 'First Note',
        content: `<h1>Welcome to Notes. This ${title}'s note</h1><p>Start writing your note here...</p>`,
        createdAt: new Date().toISOString(),
        folderId: `folder-${Date.now()}`
      }]
    };

    const updatedFolders = [...get().folders, newFolder];
    set({ folders: updatedFolders });
    await Storage.saveFolders(updatedFolders);
    return newFolder;
  },

  updateFolder: async (folderId: string, name: string) => {
    const { folders } = get();
    const folderIndex = folders.findIndex(f => f.folderId === folderId);
    if (folderIndex === -1) return;

    const updatedFolder = {
      ...folders[folderIndex],
      name
    };

    const updatedFolders = folders.map(f => 
      f.folderId === folderId ? updatedFolder : f
    );
    
    set({ folders: updatedFolders });
    await Storage.saveFolders(updatedFolders);
  },

  updateNote: async (folderId: string, noteId: string, title: string) => {
    const { folders } = get();
    const folderIndex = folders.findIndex(f => f.folderId === folderId);
    if (folderIndex === -1) return;

    const folder = folders[folderIndex];
    const noteIndex = folder.notes.findIndex(n => n.noteId === noteId);
    if (noteIndex === -1) return;

    const updatedFolder = {
      ...folder,
      notes: [
        ...folder.notes.slice(0, noteIndex),
        { ...folder.notes[noteIndex], title },
        ...folder.notes.slice(noteIndex + 1)
      ]
    };

    const updatedFolders = folders.map(f => 
      f.folderId === folderId ? updatedFolder : f
    );
    
    set({ folders: updatedFolders });
    await Storage.saveFolders(updatedFolders);
  },

  updateNoteContent: async (folderId: string, noteId: string, content: string) => {
    const { folders } = get();
    const folderIndex = folders.findIndex(f => f.folderId === folderId);
    if (folderIndex === -1) return;

    const folder = folders[folderIndex];
    const noteIndex = folder.notes.findIndex(n => n.noteId === noteId);
    if (noteIndex === -1) return;

    const updatedFolder = {
      ...folder,
      notes: [
        ...folder.notes.slice(0, noteIndex),
        { ...folder.notes[noteIndex], content },
        ...folder.notes.slice(noteIndex + 1)
      ]
    };

    const updatedFolders = folders.map(f => 
      f.folderId === folderId ? updatedFolder : f
    );
    
    set({ folders: updatedFolders });
    await Storage.saveFolders(updatedFolders);
  },

  addNote: async (folderId: string, note: Note) => {
    const { folders } = get();
    const folderIndex = folders.findIndex(f => f.folderId === folderId);
    if (folderIndex === -1) return;

    const updatedFolder = {
      ...folders[folderIndex],
      notes: [...folders[folderIndex].notes, note]
    };

    const updatedFolders = folders.map(f => 
      f.folderId === folderId ? updatedFolder : f
    );
    
    set({ folders: updatedFolders });
    await Storage.saveFolders(updatedFolders);
  },

  deleteNote: async (folderId: string, noteId: string) => {
    const { folders } = get();
    const folderIndex = folders.findIndex(f => f.folderId === folderId);
    if (folderIndex === -1) return;

    const updatedFolder = {
      ...folders[folderIndex],
      notes: folders[folderIndex].notes.filter(n => n.noteId !== noteId)
    };

    const updatedFolders = folders.map(f => 
      f.folderId === folderId ? updatedFolder : f
    );
    
    set({ folders: updatedFolders });
    await Storage.saveFolders(updatedFolders);
  },

  deleteFolder: async (folderId: string) => {
    const updatedFolders = get().folders.filter(f => f.folderId !== folderId);
    set({ folders: updatedFolders });
    await Storage.saveFolders(updatedFolders);
  }
}));