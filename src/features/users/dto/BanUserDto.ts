import { IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';

export class BanUserDto {
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;

  @IsNotEmpty()
  @MaxLength(20)
  banReason: string;
}
