import React, { useState } from 'react';
import { Trash2, Plus, Edit3, Check } from 'lucide-react';
import Task from './Task';
import api from '../services/api';
import { ProjectType, TaskType } from './types';

type Props = {
  project: ProjectType;
  onDelete: () => void;
};

export default function Project({ project, onDelete }: Props) {
  const [projectName, setProjectName] = useState<string>(project.name);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskType[]>(project.tasks || []);
  const [newTaskName, setNewTaskName] = useState<string>('');

  const handleUpdateProjectName = async () => {
    if (!projectName.trim()) return alert('Project name cannot be empty');
    try {
      await api.patch(`/projects/${project.id}`, { name: projectName });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      alert('Error updating project name');
    }
  };
  
  const handleAddTask = async () => {
    if (!newTaskName) return alert('Please provide a task name');
    try {
      const response = await api.post(`/projects/${project.id}/tasks`, { name: newTaskName });
      setTasks((prev) => [...prev, response.data]);
      setNewTaskName('');
    } catch (error) {
      console.log(error);
      alert('Error adding task');
    }
  };

  const handleTaskRemoved = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex space-x-2">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md p-2 flex-grow focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:border-indigo-400 dark:focus:border-indigo-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            />
            <button
              onClick={handleUpdateProjectName}
              className="text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300"
            >
              <Check size={20} />
            </button>
          </div>
        ) : (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{projectName}</h2>
        )}

        <div className="flex space-x-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center"
            >
              <Edit3 size={16} /> Edit
            </button>
          )}
          
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
          value={newTaskName || ''} 
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
        {tasks?.map((task) => (
          <Task
            key={task.id}
            projectId={project.id}
            task={task}
            onTaskRemoved={handleTaskRemoved}
          />
        ))}
      </ul>
    </div>
  );
}
