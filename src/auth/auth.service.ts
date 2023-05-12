import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DevicesService } from '../devices/devices.service';
import { CreateDeviceDto } from '../devices/dto/CreateDeviceDto';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly deviceService: DevicesService,
  ) {}

  async login(userId: string, login: string, title: string, ip: string) {
    const newDeviceDto: CreateDeviceDto = {
      sessionId: uuidv4(),
      userId,
      title,
      ip,
    };

    const deviceId = await this.deviceService.createDevice(newDeviceDto);

    return await this.createJwtTokens(
      userId,
      login,
      deviceId,
      newDeviceDto.sessionId,
    );
  }

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

  async updateJwtTokens(
    userId: string,
    login: string,
    deviceId: string,
    title: string,
    ip: string,
  ) {
    const sessionId = uuidv4();

    await this.deviceService.updateDevice({
      deviceId,
      sessionId,
      title,
      ip,
    });

    return await this.createJwtTokens(userId, login, deviceId, sessionId);
  }
}
