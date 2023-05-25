import {
  Controller,
  Request,
  Post,
  UseGuards,
  Ip,
  Res,
  Body,
  HttpCode,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RefreshTokenGuard } from './guards/refresh.token.guard.';
import { CreateUserDto } from '../users/dto/CreateUserDto';
import { EmailConfirmationDto } from './dto/EmailConfirmationDto';
import { UsersService } from '../users/users.service';
import { CustomResponse } from '../utils/customResponse/CustomResponse';
import { EmailDto } from './dto/EmailDto';
import { UsersQueryRepository } from '../users/repository/users.query.repository';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { PasswordRecoveryDto } from './dto/PasswordRecoveryDto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('auth')
@Throttle(5, 10)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req,
    @Ip() ip,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(process.env.THROTTLER_LIMIT, process.env.THROTTLER_TTL);
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
    response.cookie('refreshToken ', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken };
  }
  @UseGuards(JwtAuthGuard)
  @SkipThrottle()
  @Get('me')
  async me(@Request() req) {
    return await this.usersQueryRepository.getUserByIdForAuthMe(req.user.id);
  }

  @Post('registration')
  @HttpCode(204)
  async register(@Body() dto: CreateUserDto) {
    await this.authService.registration(dto);
  }

  @Throttle(3, 60)
  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(@Body() dto: EmailDto) {
    await this.authService.registrationEmailResending(dto.email);
  }
  @Post('logout')
  @SkipThrottle()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async logout(@Request() req) {
    await this.authService.logout(req.user.deviceId);
  }
  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body() dto: EmailDto) {
    return await this.authService.passwordRecovery(dto.email);
  }
  @Post('new-password')
  @HttpCode(204)
  async newPassword(@Body() dto: PasswordRecoveryDto) {
    const isSuccessful: boolean = await this.usersService.setNewPassword(
      dto.newPassword,
      dto.recoveryCode,
    );

    if (!isSuccessful) CustomResponse.throwHttpException(2);
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(@Body() dto: EmailConfirmationDto) {
    const response: CustomResponse<any> =
      await this.usersService.confirmUserEmail(dto.code);

    if (!response.isSuccess)
      CustomResponse.throwHttpException(response.errStatusCode);
  }

  @UseGuards(RefreshTokenGuard)
  @SkipThrottle()
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

    response.cookie('refreshToken ', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken };
  }
}
