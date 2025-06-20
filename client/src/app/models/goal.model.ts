export interface Goal {
  id: string;
  title: string;
  description?: string;
  deadline: Date;
  isPublic: boolean;
  parentId?: string;
  publicId?: string;
  order: number;
  children: Goal[];
  completed: boolean;
}
