export type TaskType = {
  id: string;
  name: string;
  completed: boolean;
};

export type ProjectType = {
  id: string;
  name: string;
  tasks: TaskType[];
};