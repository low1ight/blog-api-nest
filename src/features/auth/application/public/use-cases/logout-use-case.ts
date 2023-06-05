import { DevicesService } from '../../../../devices/devices.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class LogoutUseCaseCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(LogoutUseCaseCommand)
export class LogoutUseCase implements ICommandHandler<LogoutUseCaseCommand> {
  constructor(private deviceService: DevicesService) {}

  async execute({ deviceId }: LogoutUseCaseCommand) {
    await this.deviceService.deleteDeviceById(deviceId);
  }
}
