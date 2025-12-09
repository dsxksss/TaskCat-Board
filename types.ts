export type TagColor = 'purple' | 'pink' | 'cyan' | 'orange' | 'green' | 'blue';

export interface Tag {
  label: string;
  color: TagColor;
}

export interface Task {
  id: string;
  title: string;
  description?: string; // Short summary
  content?: string; // Markdown content
  tags: Tag[];
  date: string;
  statusBadge?: {
    text: string;
    type: 'todo' | 'done';
  };
  imageUrl?: string;
  hasRedDot?: boolean;
}

export interface Column {
  id: string;
  title: string;
  accentColor: string; // Tailwind class component like 'bg-orange-500'
  iconType: 'todo' | 'progress' | 'done' | 'manage';
  tasks: Task[];
}

export type DragItem = 
  | { type: 'TASK'; taskId: string; sourceColId: string }
  | { type: 'COLUMN'; colId: string };
