import { Injectable } from '@nestjs/common';
import { Device, DeviceDocument, DeviceModel } from '../schemas/device.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDeviceDto } from '../dto/CreateDeviceDto';
import { Types } from 'mongoose';

@Injectable()
export class DevicesRepository {
  constructor(@InjectModel(Device.name) private deviceModel: DeviceModel) {}

  async createDevice(dto: CreateDeviceDto) {
    return await this.deviceModel.createNewDevice(dto, this.deviceModel);
  }

  async getUserDevices(userId: string) {
    return this.deviceModel.find({
      userId: new Types.ObjectId(userId),
    });
  }

  async save(deviceModel: DeviceDocument) {
    const device = await deviceModel.save();
    return device._id.toString();
  }

  async deleteDeviceById(id: string): Promise<boolean> {
    const result = await this.deviceModel.deleteOne({ _id: id });

    return result.deletedCount === 1;
  }

  async getDeviceById(id: string) {
    return this.deviceModel.findById(id);
  }
}
