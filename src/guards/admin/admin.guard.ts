import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private usersService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { username, password } = request.body;

    const isValidAdmin = await this.usersService.validateAdminCredentials(
      username,
      password,
    );

    if (username === 'adminTera' && password === 'Gloaster@areT') {
      if (!isValidAdmin) {
        throw new UnauthorizedException('Login as admin');
      }
      return true;
    } else if (isValidAdmin) {
      throw new UnauthorizedException('Login as user');
    } else {
      throw new UnauthorizedException('You are not authorized');
    }
  }
}
