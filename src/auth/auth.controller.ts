import { Controller, Request, Post, UseGuards, Ip } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Ip() ip) {
    const payload = {
      id: req.user._id.toString(),
      userName: req.user.userData.login,
      ip: ip,
      title: req.headers['user-agent'],
    };

    return await this.authService.createJwtTokens(payload);
  }
}
