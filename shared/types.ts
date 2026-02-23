export interface LiteraryEntry {
  name: string;
  source: string;
  quote: string;
  description?: string;
  img?: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: number;
}

export interface DayData {
  todos: TodoItem[];
  schedule: string;
}

export interface StorageData {
  [dateKey: string]: DayData;
}

export interface WSMessage {
  type: 'init' | 'update';
  dateKey?: string;
  data?: StorageData | DayData;
  timestamp?: number;
}
