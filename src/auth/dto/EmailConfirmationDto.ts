import { IsNotEmpty } from 'class-validator';

export class EmailConfirmationDto {
  @IsNotEmpty()
  code: string;
}
