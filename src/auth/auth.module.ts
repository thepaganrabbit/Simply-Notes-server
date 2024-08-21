import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[UserModule, JwtModule],
  controllers: [AuthController],
  providers: []
})
export class AuthModule {}
