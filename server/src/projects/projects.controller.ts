import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/request.interface';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @Body() createProjectDto: Omit<CreateProjectDto, 'userId'>,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.sub;
    return this.projectsService.create({ ...createProjectDto, userId });
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.projectsService.findAllByUser(userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.projectsService.remove(userId, id);
  }

  @Post(':id/tasks')
  async createTask(
    @Param('id') projectId: string,
    @Body('name') name: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.sub;
    return this.projectsService.addTaskToProject({ userId, projectId, name });
  }

  @Patch(':id')
  async updateProjectName(
    @Param('id') id: string,
    @Body('name') name: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.sub;
    return this.projectsService.updateProjectName(userId, id, name);
  }

  @Delete(':projectId/tasks/:taskId')
  async removeTask(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.sub;
    return this.projectsService.removeTaskFromProject({
      projectId,
      taskId,
      userId,
    });
  }

  @Patch(':projectId/tasks/:taskId/status')
  async updateTask(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.sub;
    return this.projectsService.toggleTaskCompletedStatus({
      projectId,
      taskId,
      userId,
    });
  }
}
