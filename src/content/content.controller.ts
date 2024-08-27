import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { InTask } from 'src/types';

@Controller('content')
export class ContentController {
    constructor(private readonly contentService: ContentService){}
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
    @Post('/add-task')
    @UseGuards(AuthGuard)
    async crateTask(@Body() task: InTask) {
        return await this.contentService.addTask(task);
    }
    @Patch('/taskStatus')
    @UseGuards(AuthGuard)
    async completeTask(@Query('id') id: string ) {
        return await this.contentService.taskStateChanged(id);
    }
    @Delete('/task')
    @UseGuards(AuthGuard)
    async deleteTask(@Query('id') id: string ) {
        return await this.contentService.deleteTask(id);
    }
}
