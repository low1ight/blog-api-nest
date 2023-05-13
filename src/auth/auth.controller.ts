import { Controller, Request, Post, UseGuards, Ip, Res } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RefreshTokenGuard } from './guards/refresh.token.guard.';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req,
    @Ip() ip,
    @Res({ passthrough: true }) response: Response,
  ) {
    const id = req.user._id.toString();
    const login = req.user.userData.login;
    const title = req.headers['user-agent'];

    const { refreshToken, accessToken } = await this.authService.login(
      id,
      login,
      title,
      ip,
    );
    //add httponly + secure
    response.cookie('refreshToken ', refreshToken);

    return { accessToken };
  }
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(
    @Request() req,
    @Ip() ip,
    @Res({ passthrough: true }) response: Response,
  ) {
    const title = req.headers['user-agent'];

    const { userId, login, deviceId } = req.user;

    const { refreshToken, accessToken } =
      await this.authService.updateJwtTokens(
        userId,
        login,
        deviceId,
        title,
        ip,
      );

    response.cookie('refreshToken ', refreshToken);

    return { accessToken };
  }
}
