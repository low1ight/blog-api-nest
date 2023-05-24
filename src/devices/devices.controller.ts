import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { RefreshTokenGuard } from '../auth/guards/refresh.token.guard.';
import { CurrentUser } from '../common/decorators/current.user.decorator';
import { DevicesQueryRepository } from './repository/devices.query.repository';
import { CustomResponse } from '../utils/customResponse/CustomResponse';

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
  @HttpCode(204)
  @UseGuards(RefreshTokenGuard)
  async deleteAllOthersDevices(@CurrentUser() user) {
    return await this.devicesServices.deleteAllOthersDevices(
      user.userId,
      user.deviceId,
    );
  }

  @Delete('/devices/:id')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async terminateDeviceSessionById(
    @Param('id') deviceId: string,
    @CurrentUser() user,
  ) {
    const deletingResult: CustomResponse<any> =
      await this.devicesServices.terminateDeviceSessionById(
        deviceId,
        user.userId,
      );
    if (!deletingResult.isSuccess)
      return CustomResponse.throwHttpException(deletingResult.errStatusCode);
  }
}
