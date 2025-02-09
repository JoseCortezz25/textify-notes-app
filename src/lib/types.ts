export interface Note {
  noteId: string;
  title: string;
  content: string;
  createdAt: string;
  folderId: string;
}

export type Folder = {
  folderId: string;
  name: string;
  notes: Note[];
}
