import { CreateDeviceDto } from '../../../../devices/dto/CreateDeviceDto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../auth.service';
import { DevicesService } from '../../../../devices/devices.service';

export class LoginUseCaseCommand {
  constructor(
    public userId: string,
    public login: string,
    public title: string,
    public ip: string,
  ) {}
}
@CommandHandler(LoginUseCaseCommand)
export class LoginUseCase implements ICommandHandler<LoginUseCaseCommand> {
  constructor(
    private authService: AuthService,
    private devicesService: DevicesService,
  ) {}
  async execute({ userId, title, ip, login }: LoginUseCaseCommand) {
    const newDeviceDto: CreateDeviceDto = {
      sessionId: uuidv4(),
      userId,
      title,
      ip,
    };

    const deviceId = await this.devicesService.createDevice(newDeviceDto);

    return await this.authService.createJwtTokens(
      userId,
      login,
      deviceId,
      newDeviceDto.sessionId,
    );
  }
}
