import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, List, Trash2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import api from '../services/api';
import { authService } from '../services/authService';

type Project = {
  id: string;
  name: string;
  tasks: Task[];
};

type Task = {
  id: string;
  name: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newTask, setNewTask] = useState<{ projectId: string; name: string }>({ projectId: '', name: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsResponse = await api.get('/projects');
        setProjects(projectsResponse.data);
      } catch (error) {
        alert('Error fetching projects');
        navigate('/');
      }
    };

    fetchProjects();
  }, [navigate]);

  const handleSignOut = async () => {
    authService.removeToken();
    navigate('/');
  };

  const handleCreateProject = async () => {
    if (!newProjectName) return alert('Please provide a project name');
    try {
      const response = await api.post('/projects', { name: newProjectName });
      setProjects([...projects, response.data]); 
      setNewProjectName('');
    } catch (error) {
      alert('Error creating project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((project) => project.id !== projectId)); 
    } catch (error) {
      alert('Error deleting project');
    }
  };

  const handleAddTask = async (projectId: string) => {
    if (!newTask.name || newTask.projectId !== projectId) return alert('Please provide a task name');
    try {
      const response = await api.post(`/projects/${projectId}/tasks`, { name: newTask.name });
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId ? { ...project, tasks: [...project.tasks, response.data] } : project
        )
      );
      setNewTask({ projectId: '', name: '' });
    } catch (error) {
      alert('Error adding task');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center pt-6">
          <ThemeToggle />
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <LogOut size={20} />
            <span>Sign out</span>
          </button>
        </div>

        {/* Criar novo projeto */}
        <div className="my-12 text-center">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="New project name"
            className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-64 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:border-indigo-400 dark:focus:border-indigo-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          />
          <button
            onClick={handleCreateProject}
            className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors"
          >
            <Plus size={16} /> Create Project
          </button>
        </div>

        {/* Listar projetos */}
        <div className="space-y-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{project.name}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setNewTask({ projectId: project.id, name: '' })}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center"
                  >
                    <List size={16} /> Add Task
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 flex items-center"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>

              {/* Adicionar tarefa ao projeto */}
              {newTask.projectId === project.id && (
                <div className="mt-4 flex">
                  <input
                    type="text"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    placeholder="Task name"
                    className="border border-gray-300 dark:border-gray-600 rounded-md p-2 flex-grow focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:border-indigo-400 dark:focus:border-indigo-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                  <button
                    onClick={() => handleAddTask(project.id)}
                    className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}

              {/* Listar tarefas */}
              <ul className="mt-4 space-y-2">
                {project.tasks?.map((task) => (
                  <li key={task.id} className="text-gray-600 dark:text-gray-300">
                    - {task.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
