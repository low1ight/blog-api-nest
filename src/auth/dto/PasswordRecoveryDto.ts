import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class PasswordRecoveryDto {
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(6)
  newPassword: string;

  @IsNotEmpty()
  recoveryCode: string;
}
