import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsRepository } from './project.repository';
import { Project } from './entities/project.entity';
import { randomUUID } from 'node:crypto';
import { CreateProjectTaskDto } from './dto/create-project-task.dto';
import { Task } from './entities/task.entity';
import { ProjectTaskKeyDTO } from './dto/project-task-key.dto';

@Injectable()
export class ProjectsService {
  constructor(private projectsRepo: ProjectsRepository) {}

  async create(createProjectDto: CreateProjectDto) {
    const project: Project = {
      id: randomUUID(),
      name: createProjectDto.name,
      userId: createProjectDto.userId,
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.projectsRepo.saveProject(project);

    return project;
  }

  async findAllByUser(userId: string) {
    return this.projectsRepo.getProjects(userId);
  }

  async updateProjectName(userId: string, id: string, name: string) {
    const project = await this.projectsRepo.getProject(userId, id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.name = name;
    project.updatedAt = new Date().toISOString();

    await this.projectsRepo.saveProject(project);
    return project;
  }

  async remove(userId: string, id: string) {
    await this.projectsRepo.deleteProject(userId, id);
  }

  async addTaskToProject({ name, projectId, userId }: CreateProjectTaskDto) {
    const project = await this.projectsRepo.getProject(userId, projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const newTask: Task = {
      id: randomUUID(),
      projectId,
      name,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    project.tasks.push(newTask);

    await this.projectsRepo.saveProject(project);
    return project;
  }

  async removeTaskFromProject({
    projectId,
    taskId,
    userId,
  }: ProjectTaskKeyDTO) {
    const project = await this.projectsRepo.getProject(userId, projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.tasks = project.tasks.filter((task) => task.id !== taskId);

    await this.projectsRepo.saveProject(project);
    return project;
  }

  async toggleTaskCompletedStatus({
    projectId,
    taskId,
    userId,
  }: ProjectTaskKeyDTO) {
    const project = await this.projectsRepo.getProject(userId, projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const task = project.tasks.find((t) => t.id === taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.completed = !task.completed;
    task.updatedAt = new Date().toISOString();

    await this.projectsRepo.saveProject(project);
    return project;
  }
}
