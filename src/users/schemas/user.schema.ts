import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDto } from '../dto/CreateUserDto';

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
        expirationDate: new Date(
          Date.now() +
            1000 * 60 * +process.env.MIN_TO_EXPIRE_EMAIL_CONFIRMATION_CODE,
        ),
      },
    });
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.statics = {
  createAlreadyConfirmedUser: User.createAlreadyConfirmedUser,
  createUnconfirmedUser: User.createUnconfirmedUser,
};
