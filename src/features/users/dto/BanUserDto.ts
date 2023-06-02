export class BanUserDto {
  // @IsNotEmpty()
  // @IsBoolean()
  isBanned: boolean;

  // @IsNotEmpty()
  // @IsString()
  // @MaxLength(20)
  banReason: string;
}
