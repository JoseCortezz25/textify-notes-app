import localforage from 'localforage';
import { Folder } from '@/lib/types';

localforage.config({
  name: 'textify-notes',
  storeName: 'notes_data',
  description: 'Storage for Textify Notes application'
});

class Storage {
  private static readonly FOLDERS_KEY = 'folders';

  static async init(): Promise<Folder[]> {
    let folders = await this.getFolders();

    if (!folders || folders.length === 0) {
      const defaultFolder: Folder = {
        folderId: `folder-${Date.now()}`,
        name: 'My Notes',
        notes: [
          {
            noteId: `note-${Date.now()}`,
            title: 'Welcome Note',
            content:
              '<h1>Welcome to Textify Notes!</h1><p>Start writing your notes here...</p>',
            createdAt: new Date().toISOString(),
            folderId: `folder-${Date.now()}`
          }
        ]
      };

      folders = [defaultFolder];
      await this.saveFolders(folders);
    }

    return folders;
  }

  static async getFolders(): Promise<Folder[]> {
    try {
      const folders = await localforage.getItem<Folder[]>(this.FOLDERS_KEY);
      return folders || [];
    } catch (error) {
      console.error('Error retrieving folders from storage:', error);
      return [];
    }
  }

  static async saveFolders(folders: Folder[]): Promise<void> {
    try {
      await localforage.setItem(this.FOLDERS_KEY, folders);
    } catch (error) {
      console.error('Error saving folders to storage:', error);
    }
  }
}

export default Storage;
