import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../application/public/auth.service';
import { UserDocument } from '../../users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(loginOrEmail: string, password: string): Promise<any> {
    const user: UserDocument = await this.authService.validateUser(
      loginOrEmail,
      password,
    );
    if (!user) {
      throw new UnauthorizedException('wrong email or login');
    }
    if (!user.userConfirmationData.isConfirmed) {
      throw new UnauthorizedException('email is not confirmed');
    }
    if (user.banInfo.isBanned) {
      throw new UnauthorizedException('user was banned');
    }
    return user;
  }
}
