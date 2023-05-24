import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateDeviceDto } from './dto/CreateDeviceDto';
import { DevicesRepository } from './repository/devices.repository';
import { DeviceDocument } from './schemas/device.schema';
import { UpdateDeviceDto } from './dto/UpdateDeviceDto';

@Injectable()
export class DevicesService {
  constructor(private readonly deviceRepository: DevicesRepository) {}

  async getCurrentUserDevices(userId: string) {
    return await this.deviceRepository.getUserDevices(userId);
  }
  async createDevice(dto: CreateDeviceDto) {
    const device = await this.deviceRepository.createDevice(dto);
    //return device id
    return this.deviceRepository.save(device);
  }

  async deleteDeviceById(deviceId: string): Promise<boolean> {
    return await this.deviceRepository.deleteDeviceById(deviceId);
  }

  async isSessionIdForDeviceValid(deviceId: string, sessionId: string) {
    const device: DeviceDocument | null =
      await this.deviceRepository.getDeviceById(deviceId);

    if (!device) return false;

    return device.sessionId === sessionId;
  }

  async updateDevice({ deviceId, ...dto }: UpdateDeviceDto) {
    const device = await this.deviceRepository.getDeviceById(deviceId);
    if (!device) throw new UnauthorizedException();

    await device.updateData(dto);

    await this.deviceRepository.save(device);
  }
}
