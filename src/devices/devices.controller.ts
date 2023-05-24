import { Controller, Get, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { RefreshTokenGuard } from '../auth/guards/refresh.token.guard.';
import { CurrentUser } from '../common/decorators/current.user.decorator';

@Controller('security')
export class DevicesController {
  constructor(private readonly devicesServices: DevicesService) {}

  @Get('/devices')
  @UseGuards(RefreshTokenGuard)
  async getAllUserDevices(@CurrentUser() user) {
    return await this.devicesServices.getCurrentUserDevices(user.userId);
  }
}
