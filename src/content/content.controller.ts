import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CustomRequest, InTask } from 'src/types';
import { User } from 'src/models/User.model';
import IntUserDto from 'src/dtos/IntUser.dto';
import { ExtCategorysDto } from 'src/dtos/ExtCatagoryDto';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}
  @Get('/dictionary')
  @UseGuards(AuthGuard)
  async populateDictionary() {
    return await this.contentService.getWords();
  }
  @Get('/tasks')
  @UseGuards(AuthGuard)
  async getUsersTasks(@Req() {user}: CustomRequest) {
    return await this.contentService.getTasks(user.userId);
  }
  @Get('/tasks/all')
  @UseGuards(AuthGuard)
  async getAllTasks(@Req() {user}: CustomRequest) {
    if(!user.isAdmin) throw new UnauthorizedException();
    return await this.contentService.getTasksAdmin();
  }
  @Get('/categories')
  @UseGuards(AuthGuard)
  async getAllCategories(@Req() { user }: CustomRequest) {
    return await this.contentService.getCategories(user.isAdmin);
  }
  @Post('/add-task')
  @UseGuards(AuthGuard)
  async crateTask(@Body() task: InTask, @Req() {user}: CustomRequest) {
    return await this.contentService.addTask(task, user.userId);
  }
  @Post('/add-category')
  @UseGuards(AuthGuard)
  async crateCategory(
    @Req() { user }: CustomRequest,
    @Query('text') text: string,
  ) {
    const category = new ExtCategorysDto(text, user.userId);
    return await this.contentService.addNewCategory(category);
  }
  @Patch('/taskStatus')
  @UseGuards(AuthGuard)
  async completeTask(@Query('id') id: string, @Req() {user}: CustomRequest) {
    return await this.contentService.taskStateChanged(id, user.userId);
  }
  @Delete('/category')
  @UseGuards(AuthGuard)
  async deleteCategory(@Query('id') id: string) {
    return await this.contentService.deleteACategory(id);
  }
  @Delete('/dictionary')
  @UseGuards(AuthGuard)
  async deletWord(@Query('id') id: string) {
    return await this.contentService.deleteAWord(id);
  }
  @Delete('/task')
  @UseGuards(AuthGuard)
  async deleteTask(@Query('id') id: string, @Req() {user}: CustomRequest) {
    return await this.contentService.deleteTask(id, user.userId);
  }
}
