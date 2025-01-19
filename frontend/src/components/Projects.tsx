import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import api from '../services/api';
import { authService } from '../services/authService';
import Project from './Project';

type ProjectType = {
  id: string;
  name: string;
  tasks: TaskType[];
};

type TaskType = {
  id: string;
  name: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsResponse = await api.get('/projects');
        setProjects(projectsResponse.data);
      } catch (error) {
        console.log(error);
        alert('Error fetching projects');
        navigate('/');
      }
    };

    fetchProjects();
  }, [navigate]);

  const handleSignOut = () => {
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
      console.log(error);
      alert('Error creating project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    } catch (error) {
      console.log(error);
      alert('Error deleting project');
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
            <Project
              key={project.id}
              project={project}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
