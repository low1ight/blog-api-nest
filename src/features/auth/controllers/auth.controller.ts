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
import { LocalAuthGuard } from '../guards/local.auth.guard';
import { AuthService } from '../application/public/auth.service';
import { Response } from 'express';
import { RefreshTokenGuard } from '../guards/refresh.token.guard.';
import { CreateUserDto } from '../../users/dto/CreateUserDto';
import { EmailConfirmationDto } from '../dto/EmailConfirmationDto';
import { UsersSaService } from '../../users/application/sa/users.sa.service';
import { CustomResponse } from '../../utils/customResponse/CustomResponse';
import { EmailDto } from '../dto/EmailDto';
import { UsersQueryRepository } from '../../users/repositories/users.query.repository';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { PasswordRecoveryDto } from '../dto/PasswordRecoveryDto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { Exceptions } from '../../utils/throwException';
import { CommandBus } from '@nestjs/cqrs';
import { LoginUseCaseCommand } from '../application/public/use-cases/login-use-case';
import { RegistrationEmailResendingUseCaseCommand } from '../application/public/use-cases/registration-email-resending-use-case';
import { RegistrationUseCaseCommand } from '../application/public/use-cases/registration-use-case';
import { PasswordRecoveryUseCaseCommand } from '../application/public/use-cases/password-recovery-use-case';
import { LogoutUseCaseCommand } from '../application/public/use-cases/logout-use-case';
import { SetNewPasswordUseCaseCommand } from '../application/public/use-cases/set-new-password-use-case';
import { ConfirmEmailUseCaseCommand } from '../application/public/use-cases/confirm-email-use-case';
import { UpdateJwtTokensUseCaseCommand } from '../application/public/use-cases/update-jwt-tokens-use-case';

@Controller('auth')
@Throttle(5, 10)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersSaService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
  ) {}
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(
    @Request() req,
    @Ip() ip,
    @Res({ passthrough: true }) response: Response,
  ) {
    const id = req.user._id.toString();
    const login = req.user.userData.login;
    const title = req.headers['user-agent'];

    const { refreshToken, accessToken } = await this.commandBus.execute(
      new LoginUseCaseCommand(id, login, title, ip),
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
    await this.commandBus.execute(new RegistrationUseCaseCommand(dto));
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(@Body() dto: EmailDto) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new RegistrationEmailResendingUseCaseCommand(dto.email),
    );
    if (!result.isSuccess)
      Exceptions.throwHttpException(
        result.errStatusCode,
        result.content,
        'email',
      );
  }
  @Post('logout')
  @SkipThrottle()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async logout(@Request() req) {
    await this.commandBus.execute(new LogoutUseCaseCommand(req.user.deviceId));
  }
  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body() dto: EmailDto) {
    return await this.commandBus.execute(
      new PasswordRecoveryUseCaseCommand(dto.email),
    );
  }
  @Post('new-password')
  @HttpCode(204)
  async newPassword(@Body() dto: PasswordRecoveryDto) {
    return await this.commandBus.execute(
      new SetNewPasswordUseCaseCommand(dto.newPassword, dto.recoveryCode),
    );
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(@Body() dto: EmailConfirmationDto) {
    const response: CustomResponse<any> = await this.commandBus.execute(
      new ConfirmEmailUseCaseCommand(dto.code),
    );

    if (!response.isSuccess)
      Exceptions.throwHttpException(
        response.errStatusCode,
        response.content,
        'code',
      );
  }

  @UseGuards(RefreshTokenGuard)
  @SkipThrottle()
  @HttpCode(200)
  @Post('refresh-token')
  async refreshToken(
    @Request() req,
    @Ip() ip,
    @Res({ passthrough: true }) response: Response,
  ) {
    const title = req.headers['user-agent'];

    const { userId, login, deviceId } = req.user;

    const { refreshToken, accessToken } = await this.commandBus.execute(
      new UpdateJwtTokensUseCaseCommand(userId, login, deviceId, title, ip),
    );

    response.cookie('refreshToken ', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken };
  }
}
