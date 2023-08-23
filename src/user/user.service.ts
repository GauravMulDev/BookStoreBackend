import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(
    username: string,
    password: string,
    gender: string,
    mobileNumber: string,
    role: 'user' | 'admin' = 'user',
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      username,
      password: hashedPassword,
      gender,
      mobileNumber,
      role,
    });
    return user.save();
  }
  async validateAdmin(username: string, password: string): Promise<boolean> {
    return username === 'adminTera' && password === 'Gloaster@areT';
  }
  async validateAdminCredentials(
    username: string,
    password: string,
  ): Promise<boolean> {
    const user = await this.findOneByUsername(username);

    if (user) {
      const isPasswordMatching = await this.comparePasswords(
        password,
        user.password,
      );

      if (user.username === 'adminTera' && isPasswordMatching) {
        return true;
      }
    }

    return false;
  }
  async comparePasswords(
    providedPassword: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(providedPassword, storedPasswordHash);
  }
  async findOneByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ username: username }).exec();

      if (!user) {
      } else {
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndRemove(userId);
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return deletedUser;
  }
}
