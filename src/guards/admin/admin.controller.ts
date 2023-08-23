import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;

    if (username === 'adminTera' && password === 'Gloaster@areT') {
      return { message: 'Admin access granted' };
    }

    throw new UnauthorizedException('Invalid admin credentials');
  }
}
