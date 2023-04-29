import { Injectable } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { CustomResponse } from '../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../utils/customResponse/CustomResponseEnum';

@Injectable()
export class BlogsService {
  constructor(protected readonly userRepository: BlogsRepository) {}

  async getUsers() {
    return await this.userRepository.getUsers();
  }
  async getUserById(id: string) {
    const user = await this.userRepository.getUserById(id);
    if (!user) return new CustomResponse(CustomResponseEnum.notExist);
    return new CustomResponse(null, user);
  }
}
