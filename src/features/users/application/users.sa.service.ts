import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/Users.repository';
import { CreateUserDto } from '../dto/CreateUserDto';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../entities/user.entity';
import { CustomResponse } from '../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../utils/customResponse/CustomResponseEnum';
import { BanUserDto } from '../dto/BanUserDto';
import { LikeRepository } from '../../likes/repository/like.repository';
import { CommentsRepository } from '../../comments/repository/comments.repository';

@Injectable()
export class UsersSaService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly likesRepository: LikeRepository,
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async createUser(dto: CreateUserDto) {
    dto.password = await bcrypt.hash(dto.password, +process.env.SALT_ROUNDS);

    return await this.usersRepository.createConfirmedUser(dto);
  }

  async banUnbanUser(id, dto: BanUserDto) {
    //get user and set new ban status and ban reason
    const user: UserDocument | null = await this.usersRepository.getUserById(
      id,
    );
    if (!user) return false;

    user.setBanStatus(dto);

    await this.usersRepository.save(user);
    //ban/unban all users comments and likes
    await this.commentsRepository.setNewBanStatus(id, dto.isBanned);
    await this.likesRepository.setNewBanStatus(id, dto.isBanned);

    return true;
  }

  async registerUser(dto: CreateUserDto, confirmationCode: string) {
    dto.password = await bcrypt.hash(dto.password, +process.env.SALT_ROUNDS);
    const user = await this.usersRepository.createUnconfirmedUser(
      dto,
      confirmationCode,
    );
    await this.usersRepository.save(user);

    return user._id.toString();
  }

  async setNewPasswordRecoveryCode(email: string, code: string) {
    const user: UserDocument = await this.usersRepository.getUserByEmail(email);

    user.setPasswordRecoveryCode(code);

    await this.usersRepository.save(user);
  }

  async setNewPassword(newPassword: string, recoveryCode: string) {
    const user: UserDocument | null =
      await this.usersRepository.getUserByPasswordRecoveryCode(recoveryCode);

    if (!user) return false;

    const hashedPassword = await bcrypt.hash(
      newPassword,
      +process.env.SALT_ROUNDS,
    );

    user.setNewPassword(hashedPassword);

    await this.usersRepository.save(user);

    return true;
  }

  async confirmUserEmail(code: string) {
    const user: UserDocument | null =
      await this.usersRepository.getUserByConfirmationCode(code);

    if (!user)
      return new CustomResponse(
        false,
        CustomResponseEnum.badRequest,
        `incorrect confirmation code`,
      );

    //check is email can be confirmed and return custom response
    const response: CustomResponse<any> = user.isEmailCanBeConfirmed();

    if (!response.isSuccess) return response;

    user.confirmEmail();

    await this.usersRepository.save(user);

    return new CustomResponse(true);
  }

  async setNewConfirmationCode(
    email: string,
    code: string,
  ): Promise<CustomResponse<any>> {
    const user: UserDocument | null = await this.usersRepository.getUserByEmail(
      email,
    );

    if (!user)
      return new CustomResponse(
        false,
        CustomResponseEnum.badRequest,
        `User with ${email} don't exist`,
      );

    if (user.userConfirmationData.isConfirmed)
      return new CustomResponse(
        false,
        CustomResponseEnum.badRequest,
        `Email has already confirmed!`,
      );

    user.setNewConfirmationCode(code);

    await this.usersRepository.save(user);

    return new CustomResponse(true);
  }

  async deleteUser(id: string): Promise<boolean> {
    const isUserExist = await this.usersRepository.isUserExist(id);

    if (!isUserExist) return false;

    return await this.usersRepository.deleteUserById(id);
  }

  async isUserLoginExist(login: string) {
    return await this.usersRepository.isUserLoginExist(login);
  }

  async isUserEmailExist(email: string) {
    return await this.usersRepository.isUserEmailExist(email);
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    return await this.usersRepository.findByLoginOrEmail(loginOrEmail);
  }
}