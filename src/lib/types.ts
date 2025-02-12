export interface Folder {
  folderId: string;
  name: string;
  notes: Note[];
}

export interface Note {
  noteId: string;
  title: string;
  content: string;
  createdAt: string;
  folderId: string;
}
