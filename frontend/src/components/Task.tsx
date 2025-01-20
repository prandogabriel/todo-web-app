import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../services/api';

type TaskType = {
  id: string;
  name: string;
  completed: boolean;
};

type Props = {
  projectId: string;
  task: TaskType;
  onTaskRemoved: (taskId: string) => void; 
};

export default function Task({ projectId, task, onTaskRemoved }: Props) {
  const [taskState, setTaskState] = useState<boolean>(task.completed); 

  const handleToggleStatus = async () => {
    try {
      await api.patch(`/projects/${projectId}/tasks/${task.id}/status`, {
        completed: !task.completed,
      });
      setTaskState((prevState) => !prevState);
    } catch (error) {
      console.log(error);
      alert('Error updating task status');
    }
  };

  const handleRemoveTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/projects/${projectId}/tasks/${task.id}`);
      onTaskRemoved(task.id);
    } catch (error) {
      console.log(error);
      alert('Error deleting task');
    }
  };

  return (
    <li className="flex items-center justify-between text-gray-600 dark:text-gray-300">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={taskState}
          onChange={handleToggleStatus}
          className="mr-2 w-4 h-4 rounded focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
        />
        <span className={`${taskState ? 'line-through text-gray-400' : ''}`}>
          {task.name}
        </span>
      </div>
      <button
        onClick={handleRemoveTask}
        className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
      >
        <Trash2 size={16} />
      </button>
    </li>
  );
}
