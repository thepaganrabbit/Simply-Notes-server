import { Controller, ForbiddenException, Get, HttpStatus, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ExtUserDto } from 'src/dtos/ExtUser.dto';
import { CustomRequest, LoginObj, CustomResponse } from 'src/types';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService:UserService){}
    @Get('health')
    healthCheck() {
        return HttpStatus.OK;
    }
    @Post('/login')
    async login(@Req() { body }: Request) {
        return await this.userService.loginUserIn(body as unknown as LoginObj);
    }
    @Post('/sign-up')
    async signin(@Req() { body }: Request) {
        return this.userService.newUser(body as unknown as ExtUserDto);        
    }
    @Get('/verify')
    @UseGuards(AuthGuard)
    verifyToken(@Req() {  user }: CustomRequest): CustomResponse<boolean> {
        if(!user) throw new UnauthorizedException();
        return {
            payload: true,
            success: true,
            code: 200,
            message: 'Token still is valid.',
            error: null
        }
    }

    @Get('/is-admin')
    @UseGuards(AuthGuard)
    verifyAdminAccount(@Req() {  user }: CustomRequest): CustomResponse<boolean> {
        if(!user) throw new UnauthorizedException();
        if(!user.isAdmin) throw new ForbiddenException();
        return {
            payload: true,
            success: true,
            code: 200,
            message: 'Welcome admin.',
            error: null
        }
    }
}
