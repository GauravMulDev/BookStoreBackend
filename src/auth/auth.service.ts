import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  //   async validateUser(username: string, password: string): Promise<any> {
  //     const user = await this.userService.findOneByUsername(username);
  //     if (user && (await bcrypt.compare(password, user.password))) {
  //       return user;
  //     }
  //     return null;
  //   }
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const result = user.toObject();
      delete result.password;

      return result;
    }
    return null;
  }
  async compareHash(
    attempt: string,
    actualPasswordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(attempt, actualPasswordHash);
  }
  async validateUserFromPayload(payload: JwtPayload): Promise<any> {
    return this.userService.findOneByUsername(payload.username);
  }
  async login(user: any) {
    const payload = {
      username: user.username,

      role: user.role,
      user: user.username,
    };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
      user: user.username,
    };
  }
  async signup(dto: {
    username: string;
    email: string;
    password: string;

    mobileNumber: string;
  }) {
    const existingUser = await this.userService.findOneByUsername(dto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const user = await this.userService.createUser(
      dto.username,
      dto.password,
      dto.email,
      dto.mobileNumber,
    );
    return this.login(user);
  }
}
