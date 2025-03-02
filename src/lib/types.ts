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

export type CreativityLevel = 'high' | 'medium' | 'low';
export type ToneType = 'professional' | 'fun' | 'informative' | 'explanatory';
