import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

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
        request.user = this.jwt.decode(token);
        return true
      } catch (error) {
        console.error(error)
        return false;
      }
    }
    return false;
  }
}
