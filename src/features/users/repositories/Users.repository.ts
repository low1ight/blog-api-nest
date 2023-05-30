import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModel } from '../entities/user.entity';
import { CreateUserDto } from '../dto/CreateUserDto';
import { userObjToViewModel } from './mappers/toUserViewModel';
import { Types } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async createConfirmedUser(dto: CreateUserDto) {
    const user = await this.userModel.createAlreadyConfirmedUser(
      dto,
      this.userModel,
    );

    const createdUser: UserDocument = await user.save();

    return userObjToViewModel(createdUser);
  }

  async getUserByEmail(email: string) {
    return this.userModel.findOne({ 'userData.email': email });
  }

  async getUserByPasswordRecoveryCode(code: string) {
    return this.userModel.findOne({ 'userData.passwordRecoveryCode': code });
  }

  async createUnconfirmedUser(dto: CreateUserDto, confirmationCode: string) {
    return await this.userModel.createUnconfirmedUser(
      dto,
      this.userModel,
      confirmationCode,
    );
  }

  async save(user: UserDocument) {
    await user.save();
  }

  async getUserByConfirmationCode(code: string) {
    return this.userModel.findOne({
      'userConfirmationData.confirmationCode': code,
    });
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

  async getUserById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async isUserLoginExist(login: string): Promise<boolean> {
    const user = await this.userModel.findOne({ 'userData.login': login });
    return !!user;
  }

  async isUserEmailExist(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ 'userData.email': email });
    return !!user;
  }

  async findByLoginOrEmail(loginOrEmail): Promise<UserDocument | null> {
    return this.userModel.findOne({
      $or: [
        { 'userData.login': loginOrEmail },
        { 'userData.email': loginOrEmail },
      ],
    });
  }
}
