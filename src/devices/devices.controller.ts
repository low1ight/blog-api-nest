import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { RefreshTokenGuard } from '../auth/guards/refresh.token.guard.';
import { CurrentUser } from '../common/decorators/current.user.decorator';
import { DevicesQueryRepository } from './repository/devices.query.repository';

@Controller('security')
export class DevicesController {
  constructor(
    private readonly devicesServices: DevicesService,
    private readonly devicesQueryRepository: DevicesQueryRepository,
  ) {}

  @Get('/devices')
  @UseGuards(RefreshTokenGuard)
  async getAllUserDevices(@CurrentUser() user) {
    return await this.devicesQueryRepository.getUserDevices(user.userId);
  }
  @Delete('/devices')
  @UseGuards(RefreshTokenGuard)
  async deleteAllOthersDevices(@CurrentUser() user) {
    return await this.devicesServices.deleteAllOthersDevices(
      user.userId,
      user.deviceId,
    );
  }
}
