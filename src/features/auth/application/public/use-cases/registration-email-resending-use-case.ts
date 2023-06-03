import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { UsersSaService } from '../../../../users/application/sa/users.sa.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { EmailManager } from '../../../../adapters/email.manager';

export class RegistrationEmailResendingUseCaseCommand {
  constructor(public email: string) {}
}
@CommandHandler(RegistrationEmailResendingUseCaseCommand)
export class RegistrationEmailResendingUseCase
  implements ICommandHandler<RegistrationEmailResendingUseCaseCommand>
{
  //????
  constructor(
    private usersService: UsersSaService,
    private emailManager: EmailManager,
  ) {}
  async execute({
    email,
  }: RegistrationEmailResendingUseCaseCommand): Promise<CustomResponse<any>> {
    const confirmationCode = uuidv4();

    const result: CustomResponse<any> =
      await this.usersService.setNewConfirmationCode(email, confirmationCode);

    if (!result.isSuccess) return result;

    await this.emailManager.sendConfirmationCode(email, confirmationCode);

    return new CustomResponse(true);
  }
}
