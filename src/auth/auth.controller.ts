import { Controller, Request, Post, UseGuards, Ip } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Ip() ip) {
    const id = req.user._id.toString();
    const login = req.user.userData.login;
    const title = req.headers['user-agent'];

    return await this.authService.login(id, login, title, ip);
  }
}
