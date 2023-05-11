import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { CreateDeviceDto } from '../dto/CreateDeviceDto';

export type DeviceDocument = HydratedDocument<Device>;

export interface DeviceModel extends Model<DeviceDocument> {
  createNewDevice(
    dto: CreateDeviceDto,
    deviceModel: DeviceModel,
  ): Promise<DeviceDocument>;
}

@Schema({ timestamps: true })
export class Device {
  @Prop({ type: String, required: true })
  sessionId: string;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  static async createNewDevice(
    dto: CreateDeviceDto,
    deviceModel: Model<Device>,
  ) {
    return new deviceModel(dto);
  }
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

DeviceSchema.statics = {
  createNewDevice: Device.createNewDevice,
};
