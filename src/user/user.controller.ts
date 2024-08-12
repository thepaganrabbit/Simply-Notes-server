import { Controller, Get, HttpStatus, NotAcceptableException, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CustomRequest, LoginObj } from 'src/types';
import { ExtUserDto } from 'src/dtos/ExtUser.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}
    @Get('health')
    healthCheck() {
        return HttpStatus.OK;
    }
    async login(@Req() { body }: Request) {
        return await this.userService.loginUserIn(body as unknown as LoginObj);
    }
    async signin(@Req() { body }: Request) {
        return this.userService.newUser(body as unknown as ExtUserDto);        
    }
    async getUsers(@Req() req: CustomRequest) {
        if(!req.user) {
            return new UnauthorizedException();
        }
        return this.userService.getUsers(req.user)
    }
}
