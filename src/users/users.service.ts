import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repository/Users.repository';
import { CreateUserDto } from './dto/CreateUserDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto) {
    dto.password = await bcrypt.hash(dto.password, process.env.SALT_ROUNDS);
    return await this.usersRepository.createUser(dto);
  }

  async deleteUser(id: string): Promise<boolean> {
    const isUserExist = await this.usersRepository.isUserExist(id);

    if (!isUserExist) return false;

    return await this.usersRepository.deleteUserById(id);
  }

  async isUserLoginExist(login: string) {
    return await this.usersRepository.isUserLoginExist(login);
  }

  async isEmailLoginExist(email: string) {
    return await this.usersRepository.isUserEmailExist(email);
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    return await this.usersRepository.findByLoginOrEmail(loginOrEmail);
  }
}
