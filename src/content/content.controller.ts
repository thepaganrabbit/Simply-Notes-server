import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
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
  async getUsersTasks() {
    return await this.contentService.getTasks();
  }
  @Get('/categories')
  @UseGuards(AuthGuard)
  async getAllCategories(@Req() { user }: CustomRequest) {
    return await this.contentService.getCategories(user.isAdmin);
  }
  @Post('/add-task')
  @UseGuards(AuthGuard)
  async crateTask(@Body() task: InTask) {
    return await this.contentService.addTask(task);
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
  async completeTask(@Query('id') id: string) {
    return await this.contentService.taskStateChanged(id);
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
  async deleteTask(@Query('id') id: string) {
    return await this.contentService.deleteTask(id);
  }
}
