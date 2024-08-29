import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import  * as time from 'moment';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService, private readonly configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if(request.headers.authorization) {
      try {
        const token = request.headers.authorization.split(' ')[1];
        const isValid = this.jwt.verify(token, {secret: this.configService.get<string>('jwtSecret')});
       if(!isValid) throw new UnauthorizedException();
       const {exp, ...user} = this.jwt.decode(token);
        request.user = user;
        return true
      } catch (error) {
        return false;
      }
    }
    return false;
  }
}
