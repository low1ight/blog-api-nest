import { Injectable } from '@nestjs/common';
import { Device, DeviceModel } from '../schemas/device.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDeviceDto } from '../dto/CreateDeviceDto';

@Injectable()
export class DevicesRepository {
  constructor(@InjectModel(Device.name) private deviceModel: DeviceModel) {}

  async createDevice(dto: CreateDeviceDto) {
    const createdDevice = await this.deviceModel.createNewDevice(
      dto,
      this.deviceModel,
    );

    await createdDevice.save();
  }
}
