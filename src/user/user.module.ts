import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/User.model';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      global: true, 
      secret: configService.get<string>('jwtSecret'),
      signOptions: { expiresIn: '5m' },
    }),
    inject: [ConfigService],
  }),],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [UserService]
})
export class UserModule {}
