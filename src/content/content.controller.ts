import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CustomRequest } from 'src/types';

@Controller('content')
export class ContentController {
    constructor(private readonly contentService: ContentService){}
    @Get('/dictionary')
    @UseGuards(AuthGuard)
    async populateDictionary(@Req() req: CustomRequest) {
        return await this.contentService.getWords();
    }
}
