import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDto } from '../dto/CreateUserDto';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

export interface UserModel extends Model<UserDocument> {
  createAlreadyRegisteredUser(
    dto: CreateUserDto,
    userModel: UserModel,
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

  static async createAlreadyRegisteredUser(
    dto: CreateUserDto,
    userModel: Model<User>,
  ) {
    const user = new userModel({
      userData: {
        login: dto.login,
        password: await bcrypt.hash(dto.password, 10),
        passwordRecoveryCode: null,
        email: dto.email,
      },
      userConfirmationData: {
        confirmationCode: 'auto-confirmed',
        isConfirmed: true,
        expirationDate: new Date(),
      },
    });
    return await user.save();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.statics = {
  createAlreadyRegisteredUser: User.createAlreadyRegisteredUser,
};
