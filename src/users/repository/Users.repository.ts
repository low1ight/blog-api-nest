import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/CreateUserDto';
import { userObjToViewModel } from './mappers/toUserViewModel';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userModel.createAlreadyRegisteredUser(
      dto,
      this.userModel,
    );

    return userObjToViewModel(user);
  }
}
