import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import Task from './Task';
import api from '../services/api';

type TaskType = {
  id: string;
  name: string;
  completed: boolean;
};

type ProjectType = {
  id: string;
  name: string;
  tasks: TaskType[];
};

type Props = {
  project: ProjectType;
  onDelete: () => void;
};

export default function Project({ project, onDelete }: Props) {
  const [tasks, setTasks] = useState<TaskType[]>(project.tasks);
  const [newTaskName, setNewTaskName] = useState<string>('');

  const handleAddTask = async () => {
    if (!newTaskName) return alert('Please provide a task name');
    try {
      const response = await api.post(`/projects/${project.id}/tasks`, { name: newTaskName });
      setTasks(response.data.tasks); // Atualiza todas as tarefas com o retorno do backend
      setNewTaskName('');
    } catch (error) {
      console.log(error);
      alert('Error adding task');
    }
  };

  const handleRemoveTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/projects/${project.id}/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId)); // Remove a tarefa localmente
    } catch (error) {
      console.log(error);
      alert('Error deleting task');
    }
  };

  const handleToggleTaskStatus = async (taskId: string, completed: boolean) => {
    try {
      const response = await api.patch(`/projects/${project.id}/tasks/${taskId}/status`, { completed: !completed });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: response.data.completed } : task
        )
      ); // Atualiza o status da tarefa
    } catch (error) {
      console.log(error);
      alert('Error updating task status');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{project.name}</h2>
        <div className="flex space-x-2">
          <button
            onClick={onDelete}
            className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 flex items-center"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Adicionar tarefa */}
      <div className="mt-4 flex">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="New task name"
          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 flex-grow focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:border-indigo-400 dark:focus:border-indigo-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
        />
        <button
          onClick={handleAddTask}
          className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Listar tarefas */}
      <ul className="mt-4 space-y-2">
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onRemove={() => handleRemoveTask(task.id)}
            onToggleStatus={() => handleToggleTaskStatus(task.id, task.completed)}
          />
        ))}
      </ul>
    </div>
  );
}
