import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDto } from '../dto/CreateUserDto';
import { EmailHelper } from '../../utils/emailHelper';
import { CustomResponse } from '../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../utils/customResponse/CustomResponseEnum';

export type UserDocument = HydratedDocument<User>;

export interface UserModel extends Model<UserDocument> {
  createAlreadyConfirmedUser(
    dto: CreateUserDto,
    userModel: UserModel,
  ): Promise<UserDocument>;

  createUnconfirmedUser(
    dto: CreateUserDto,
    userModel: Model<User>,
    confirmationCode: string,
  ): Promise<UserDocument>;
}

@Schema({ _id: false, timestamps: true })
export class UserData {
  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, default: null })
  passwordRecoveryCode: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

@Schema({ _id: false })
export class BanInfo {
  @Prop({ type: Boolean, default: false })
  isBanned: boolean;

  @Prop({ type: String, default: null })
  banReason: string;

  @Prop({ type: Date, default: null })
  banDate: Date;
}

@Schema({ _id: false })
export class UserConfirmationData {
  @Prop({ type: String, required: true })
  confirmationCode: string;

  @Prop({ type: Boolean, required: true })
  isConfirmed: boolean;

  @Prop({ type: Date, required: true })
  expirationDate: Date;
}

@Schema()
export class User {
  @Prop({ type: UserData, required: true })
  userData: UserData;

  @Prop({ type: UserConfirmationData, required: true })
  userConfirmationData: UserConfirmationData;

  @Prop({ type: BanInfo, default: () => new BanInfo() })
  banInfo: BanInfo;

  isEmailCanBeConfirmed() {
    if (this.userConfirmationData.isConfirmed)
      return new CustomResponse(
        false,
        CustomResponseEnum.badRequest,
        'User email has already confirmed',
      );
    //return true if email not confirmed and confirmation code not expired

    if (this.userConfirmationData.expirationDate < new Date())
      return new CustomResponse(
        false,
        CustomResponseEnum.badRequest,
        'Confirmation code was expired',
      );

    return new CustomResponse(true);
  }

  banUser(banReason: string) {
    this.banInfo.isBanned = true;
    this.banInfo.banReason = banReason;
    this.banInfo.banDate = new Date();
  }

  unbanUser() {
    this.banInfo.isBanned = false;
    this.banInfo.banReason = null;
    this.banInfo.banDate = null;
  }

  setNewConfirmationCode(code: string) {
    this.userConfirmationData.confirmationCode = code;
    this.userConfirmationData.expirationDate =
      EmailHelper.setNewConfirmationCodeDate();
  }

  setPasswordRecoveryCode(code: string) {
    this.userData.passwordRecoveryCode = code;
  }

  setNewPassword(newPassword: string) {
    this.userData.password = newPassword;
    this.userData.passwordRecoveryCode = null;
  }

  confirmEmail() {
    if (!this.isEmailCanBeConfirmed())
      throw new Error(`user can't be confirmed`);
    this.userConfirmationData.isConfirmed = true;
  }

  static async createAlreadyConfirmedUser(
    dto: CreateUserDto,
    userModel: Model<User>,
  ) {
    return new userModel({
      userData: {
        login: dto.login,
        password: dto.password,
        passwordRecoveryCode: null,
        email: dto.email,
      },
      userConfirmationData: {
        confirmationCode: 'auto-confirmed',
        isConfirmed: true,
        expirationDate: new Date(),
      },
    });
  }

  static async createUnconfirmedUser(
    dto: CreateUserDto,
    userModel: Model<User>,
    confirmationCode: string,
  ) {
    return new userModel({
      userData: {
        login: dto.login,
        password: dto.password,
        passwordRecoveryCode: null,
        email: dto.email,
      },
      userConfirmationData: {
        confirmationCode: confirmationCode,
        isConfirmed: false,
        expirationDate: EmailHelper.setNewConfirmationCodeDate(),
      },
    });
  }
}

export const UserEntity = SchemaFactory.createForClass(User);

UserEntity.methods = {
  isEmailCanBeConfirmed: User.prototype.isEmailCanBeConfirmed,
  confirmEmail: User.prototype.confirmEmail,
  setNewConfirmationCode: User.prototype.setNewConfirmationCode,
  setPasswordRecoveryCode: User.prototype.setPasswordRecoveryCode,
  setNewPassword: User.prototype.setNewPassword,
  banUser: User.prototype.banUser,
  unbanUser: User.prototype.unbanUser,
};

UserEntity.statics = {
  createAlreadyConfirmedUser: User.createAlreadyConfirmedUser,
  createUnconfirmedUser: User.createUnconfirmedUser,
};
