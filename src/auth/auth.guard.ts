import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if(request.headers.authorization) {
      try {
        const token = request.headers.authorization.split(' ');
        this.jwt.verify(token);
        request.user = this.jwt.decode(token);
        return true
      } catch (error) {
        return false;
      }
    }
    return false;
  }
}
