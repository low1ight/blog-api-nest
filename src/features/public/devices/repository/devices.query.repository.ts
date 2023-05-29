import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument, DeviceModel } from '../schemas/device.schema';

@Injectable()
export class DevicesQueryRepository {
  constructor(@InjectModel(Device.name) private deviceModel: DeviceModel) {}
  async getUserDevices(userId: string) {
    const devices = await this.deviceModel.find({
      userId: new Types.ObjectId(userId),
    });

    return this.toDevicesViewModel(devices);
  }

  toDevicesViewModel(devices: DeviceDocument[]) {
    return devices.map((device: DeviceDocument) => {
      return {
        deviceId: device._id.toString(),
        ip: device.ip,
        lastActiveDate: device.updatedAt,
        title: device.title,
      };
    });
  }
}
