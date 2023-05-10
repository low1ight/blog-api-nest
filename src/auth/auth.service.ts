import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
  //userLogin, title, ip
  async createJwtTokens(payload) {
    const [at, rt]: string[] = await Promise.all([
      this.jwtService.signAsync(
        { id: payload.id, userName: payload.userName },
        { expiresIn: '5m' },
      ),
      this.jwtService.signAsync({ payload }, { expiresIn: '60m' }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}
