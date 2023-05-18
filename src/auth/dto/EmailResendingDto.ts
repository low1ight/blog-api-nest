import { IsNotEmpty } from 'class-validator';

export class EmailResendingDto {
  @IsNotEmpty()
  email: string;
}
