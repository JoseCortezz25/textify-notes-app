// src/stores/note.ts
import { create } from 'zustand';
import { Folder, Note } from '@/lib/types';
import Database from '@/lib/indexed-db';

interface FolderStore {
  folders: Folder[];
  loading: boolean;
  createFolder: (title: string) => Promise<void>;
  updateNote: (folderId: string, noteId: string, title: string) => Promise<void>;
  addNote: (folderId: string, note: Note) => Promise<void>;
  deleteNote: (folderId: string, noteId: string) => Promise<void>;
  initializeFolders: () => Promise<void>;
}

export const useNoteStore = create<FolderStore>((set, get) => ({
  folders: [],
  loading: true,

  initializeFolders: async () => {
    try {
      const folders = await Database.getInstance().getAllFolders();
      set({ folders, loading: false });
    } catch (error) {
      console.error('Error loading folders:', error);
      set({ loading: false });
    }
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

    try {
      await Database.getInstance().addFolder(newFolder);
      set(state => ({ folders: [...state.folders, newFolder] }));
    } catch (error) {
      console.error('Error creating folder:', error);
    }
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

    try {
      await Database.getInstance().updateFolder(updatedFolder);
      set(state => ({
        folders: state.folders.map(f => 
          f.folderId === folderId ? updatedFolder : f
        )
      }));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  },

  addNote: async (folderId: string, note: Note) => {
    const { folders } = get();
    const folderIndex = folders.findIndex(f => f.folderId === folderId);
    if (folderIndex === -1) return;

    const updatedFolder = {
      ...folders[folderIndex],
      notes: [...folders[folderIndex].notes, note]
    };

    try {
      await Database.getInstance().updateFolder(updatedFolder);
      set(state => ({
        folders: state.folders.map(f => 
          f.folderId === folderId ? updatedFolder : f
        )
      }));
    } catch (error) {
      console.error('Error adding note:', error);
    }
  },

  deleteNote: async (folderId: string, noteId: string) => {
    const { folders } = get();
    const folderIndex = folders.findIndex(f => f.folderId === folderId);
    if (folderIndex === -1) return;

    const updatedFolder = {
      ...folders[folderIndex],
      notes: folders[folderIndex].notes.filter(n => n.noteId !== noteId)
    };

    try {
      await Database.getInstance().updateFolder(updatedFolder);
      set(state => ({
        folders: state.folders.map(f => 
          f.folderId === folderId ? updatedFolder : f
        )
      }));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }
}));