import { Controller, Request, Post, UseGuards, Ip, Res } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';

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
}
