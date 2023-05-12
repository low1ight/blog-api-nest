import { Injectable } from '@nestjs/common';
import { Device, DeviceDocument, DeviceModel } from '../schemas/device.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDeviceDto } from '../dto/CreateDeviceDto';

@Injectable()
export class DevicesRepository {
  constructor(@InjectModel(Device.name) private deviceModel: DeviceModel) {}

  async createDevice(dto: CreateDeviceDto) {
    return await this.deviceModel.createNewDevice(dto, this.deviceModel);
  }

  async save(deviceModel: DeviceDocument) {
    const device = await deviceModel.save();
    return device._id.toString();
  }

  async getDeviceById(id: string) {
    return this.deviceModel.findById(id);
  }
}
