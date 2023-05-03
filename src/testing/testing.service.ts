import { Injectable } from '@nestjs/common';
import { TestingRepository } from './repository/testing.repository';

@Injectable()
export class TestingService {
  constructor(private readonly testingRepository: TestingRepository) {}

  async deleteAllData() {
    return await this.testingRepository.deleteAllData();
  }
}
