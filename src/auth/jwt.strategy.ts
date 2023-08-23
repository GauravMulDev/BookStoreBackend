import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "YOUR_JWT_SECRET_HERE",
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const user = await this.authService.validateUserFromPayload(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
