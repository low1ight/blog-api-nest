import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { DevicesService } from '../../../../devices/devices.service';
import { AuthService } from '../auth.service';

export class UpdateJwtTokensUseCaseCommand {
  constructor(
    public userId: string,
    public login: string,
    public deviceId: string,
    public title: string,
    public ip: string,
  ) {}
}
@CommandHandler(UpdateJwtTokensUseCaseCommand)
export class UpdateJwtTokensUseCase
  implements ICommandHandler<UpdateJwtTokensUseCaseCommand>
{
  constructor(
    private devicesService: DevicesService,
    private authService: AuthService,
  ) {}

  async execute({
    userId,
    login,
    deviceId,
    title,
    ip,
  }: UpdateJwtTokensUseCaseCommand) {
    const sessionId = uuidv4();

    await this.devicesService.updateDevice({
      deviceId,
      sessionId,
      title,
      ip,
    });

    return await this.authService.createJwtTokens(
      userId,
      login,
      deviceId,
      sessionId,
    );
  }
}
