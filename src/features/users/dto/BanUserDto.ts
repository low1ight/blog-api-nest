import { IsNotEmpty, MaxLength } from 'class-validator';

export class BanUserDto {
  @IsNotEmpty()
  isBanned: boolean;

  @IsNotEmpty()
  @MaxLength(20)
  banReason: string;
}
