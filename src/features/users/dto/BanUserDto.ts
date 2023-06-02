import { IsBoolean, IsNotEmpty, MinLength } from 'class-validator';

export class BanUserDto {
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;

  @IsNotEmpty()
  @MinLength(20)
  banReason: string;
}
