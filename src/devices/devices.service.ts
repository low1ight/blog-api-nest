import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/CreateDeviceDto';
import { DevicesRepository } from './repository/devices.repository';

@Injectable()
export class DevicesService {
  constructor(private readonly deviceRepository: DevicesRepository) {}
  async createDevice(dto: CreateDeviceDto) {
    await this.deviceRepository.createDevice(dto);
  }
}
