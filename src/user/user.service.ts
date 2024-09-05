import {
  BadRequestException,
  HttpCode,
  Injectable,
  NotAcceptableException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as times from 'moment';
import { Model } from 'mongoose';
import { ExtUserDto } from 'src/dtos/ExtUser.dto';
import IntUserDto from 'src/dtos/IntUser.dto';
import { UserOutDto } from 'src/dtos/UserOut.dto';
import { User } from 'src/models/User.model';
import { CustomResponse, LoginObj } from 'src/types';

const bcrypt = require('bcrypt');
const saltRounds = 10;
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async newUser(user: ExtUserDto): Promise<CustomResponse<UserOutDto | null>> {
    try {
      const { password, ...rest } = user;
      const hash = await bcrypt.hash(password, saltRounds);
      const new_user = {
        password: hash,
        ...rest,
      };
      const user_added = new this.userModel(new_user);
      const db_user = await user_added.save();
      const jwt = this.jwt.sign(
        {
          userId: db_user._id,
          ...rest,
        },
        {
          expiresIn: '30zm',
          secret: this.configService.get<string>('jwtSecret'),
        },
      );
      return {
        payload: {
          userId: db_user._id,
          ...rest,
          token: jwt,
        },
        code: 200,
        success: true,
      };
    } catch (error) {
      console.error(error);
    }
  }
  async loginUserIn(
    credentials: LoginObj,
  ): Promise<CustomResponse<UserOutDto | null>> {
    const { username, password } = credentials;
    if (!username || !password) {
      throw new NotAcceptableException();
    }
    try {
      const user = await this.userModel.findOne<User>({ username });
      if(!user) throw new BadRequestException();
      if (bcrypt.compare(password, user.password)) {
        const { password, _id, ...rest } = user;
        const cleanedUser = {
          username: user.username,
          name: user.name,
          userId: user._id,
          isAdmin: user.isAdmin
        };
        const jwt = this.jwt.sign(cleanedUser, {
          expiresIn: '1d',
          secret: this.configService.get<string>('jwtSecret'),
        });
        delete cleanedUser['isAdmin'];
        return {
          success: true,
          code: 200,
          payload: {
            userId: _id,
            ...cleanedUser,
            token: jwt,
          } as UserOutDto,
        };
      }
      throw new UnauthorizedException();
    } catch (error) {
      console.error('logUserIn', error);
      return {
        payload: null,
        code: error.status,
        success: false,
        message: 'Information does not match, please try again later.',
      };
    }
  }
  async getUsers(
    req_user: IntUserDto,
  ): Promise<CustomResponse<ExtUserDto[] | null>> {
    try {
      if (!req_user.isAdmin) {
        throw new UnauthorizedException();
      }
      const users = (await this.userModel.find({})).map((user: any) => {
        const { _doc } = user;
        const {password, __v, _id, ...rest} = _doc;
        return {
          userId: _id,
          ...rest,
        };
      }) as unknown as ExtUserDto[];
      return {
        payload: users,
        code: 200,
        success: true,
      };
    } catch (error) {
      return {
        payload: null,
        success: false,
        code: 404,
        message: 'failed to authorize the login',
        error: error.message,
      };
    }
  }
}
