import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CustomRequest, LoginObj } from 'src/types';
import { ExtUserDto } from 'src/dtos/ExtUser.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from 'src/dtos/UpdateUserDto';

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

    @Get('/:id')
    @UseGuards(AuthGuard)
    async getAUser(@Req() req: CustomRequest, @Param('id') id: string) {
        if(!req.user) {
            return new UnauthorizedException();
        }
        return this.userService.getUser(id)
    }

    @Patch('/')
    @UseGuards(AuthGuard)
    async updateAUser(@Req() req: CustomRequest, @Body() user: UpdateUserDto) {
        if(!req.user && !req.user.isAdmin) {
            return new UnauthorizedException();
        }
        return this.userService.updateUser(user)
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    async deleteAUser(@Req() req: CustomRequest, @Param('id') id: string) {
        if(!req.user && !req.user.isAdmin) {
            return new UnauthorizedException();
        }
        return this.userService.deleteUser(id)
    }
    
}
