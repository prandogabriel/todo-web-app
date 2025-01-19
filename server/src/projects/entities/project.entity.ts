import { Task } from './task.entity';

export class Project {
  id: string;
  name: string;
  userId: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}
