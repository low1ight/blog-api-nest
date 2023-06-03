import { Injectable } from '@nestjs/common';
import { UsersSaService } from '../../../users/application/sa/users.sa.service';
import { UserDocument } from '../../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersSaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginOrEmail: string, pass: string): Promise<any> {
    const user: UserDocument | null =
      await this.usersService.findByLoginOrEmail(loginOrEmail);

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(
        pass,
        user.userData.password,
      );
      if (!isPasswordCorrect) return null;

      return user;
    }
    return null;
  }

  async createJwtTokens(userId, login, deviceId, sessionId) {
    const [at, rt]: string[] = await Promise.all([
      this.jwtService.signAsync(
        { id: userId, userName: login },
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME },
      ),
      this.jwtService.signAsync(
        { userId, login, deviceId, sessionId },
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}
