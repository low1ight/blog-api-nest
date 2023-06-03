import { v4 as uuidv4 } from 'uuid';
import { UsersSaService } from '../../../../users/application/sa/users.sa.service';
import { EmailManager } from '../../../../adapters/email.manager';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class PasswordRecoveryUseCaseCommand {
  constructor(public email: string) {}
}
@CommandHandler(PasswordRecoveryUseCaseCommand)
export class PasswordRecoveryUseCase
  implements ICommandHandler<PasswordRecoveryUseCaseCommand>
{
  constructor(
    private usersService: UsersSaService,
    private emailManager: EmailManager,
  ) {}

  async execute({ email }: PasswordRecoveryUseCaseCommand) {
    const isUserEmailExist = await this.usersService.isUserEmailExist(email);

    if (!isUserEmailExist) return;

    const passwordRecoveryCode = uuidv4();

    await this.usersService.setNewPasswordRecoveryCode(
      email,
      passwordRecoveryCode,
    );

    await this.emailManager.sendPasswordRecoveryCode(
      email,
      passwordRecoveryCode,
    );
  }
}
