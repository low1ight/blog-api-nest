import { CreateUserDto } from '../../../../users/dto/CreateUserDto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { UsersSaService } from '../../../../users/application/sa/users.sa.service';
import { EmailManager } from '../../../../adapters/email.manager';

export class RegistrationUseCaseCommand {
  constructor(public dto: CreateUserDto) {}
}
@CommandHandler(RegistrationUseCaseCommand)
export class RegistrationUseCase
  implements ICommandHandler<RegistrationUseCaseCommand>
{
  constructor(
    private usersService: UsersSaService,
    private emailManager: EmailManager,
  ) {}

  async execute({ dto }: RegistrationUseCaseCommand) {
    const confirmationCode = uuidv4();

    await this.usersService.registerUser(dto, confirmationCode);

    await this.emailManager.sendConfirmationCode(dto.email, confirmationCode);
  }
}
