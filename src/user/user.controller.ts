import { Controller, Get, HttpStatus, NotAcceptableException, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CustomRequest, LoginObj } from 'src/types';
import { ExtUserDto } from 'src/dtos/ExtUser.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}
    @Get('health')
    healthCheck() {
        return HttpStatus.OK;
    }
    @Get('/')
    @UseGuards(AuthGuard)
    async getUsers(@Req() req: CustomRequest) {
        if(!req.user) {
            return new UnauthorizedException();
        }
        return this.userService.getUsers(req.user)
    }
}
