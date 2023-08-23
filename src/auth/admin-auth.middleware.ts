import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminAuthMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const adminUsername = this.configService.get('ADMIN_USERNAME');
    const adminPassword = this.configService.get('ADMIN_PASSWORD');

    const authHeader = req.headers.authorization;

    if (authHeader) {
      const [username, password] = Buffer.from(
        authHeader.split(' ')[1],
        'base64',
      )
        .toString()
        .split(':');

      if (username === adminUsername && password === adminPassword) {
        return next();
      }
    }

    throw new UnauthorizedException('Invalid admin credentials');
  }
}
