import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceModel } from '../schemas/device.schema';

@Injectable()
export class DevicesQueryRepository {
  constructor(@InjectModel(Device.name) private deviceModel: DeviceModel) {}
  async getUserDevices(userId: string) {
    return this.deviceModel.find({
      userId: new Types.ObjectId(userId),
    });
  }
}
