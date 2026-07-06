export interface AnalystNote {
  id: string;
  author: string;
  role: string;
  organization: string;
  content: string;
  date: string;
  category: NoteCategory;
}

export interface NoteCategory {
  type: string;
  designation: string;
}
