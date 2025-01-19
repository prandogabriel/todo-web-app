import React from 'react';
import { Trash2 } from 'lucide-react';

type TaskType = {
  id: string;
  name: string;
  completed: boolean;
};

type Props = {
  task: TaskType;
  onRemove: () => void;
  onToggleStatus: () => void;
};

export default function Task({ task, onRemove, onToggleStatus }: Props) {
  return (
    <li className="flex items-center justify-between text-gray-600 dark:text-gray-300">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggleStatus}
          className="mr-2 w-4 h-4 rounded focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
        />
        <span className={`${task.completed ? 'line-through text-gray-400' : ''}`}>
          {task.name}
        </span>
      </div>
      <button
        onClick={onRemove}
        className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
      >
        <Trash2 size={16} />
      </button>
    </li>
  );
}
