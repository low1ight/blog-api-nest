import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/CreateUserDto';
import { userObjToViewModel } from './mappers/toUserViewModel';
import { Types } from 'mongoose';

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

  async deleteUserById(id: string): Promise<boolean> {
    const deleteResult = await this.userModel.deleteOne({ _id: id });

    return deleteResult.deletedCount === 1;
  }

  async isUserExist(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;

    const user = await this.userModel.exists({ _id: id });

    return !!user;
  }
}
