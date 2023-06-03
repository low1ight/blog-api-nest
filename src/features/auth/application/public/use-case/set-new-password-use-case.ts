import { UserDocument } from '../../../../users/entities/user.entity';
import { UsersRepository } from '../../../../users/repositories/Users.repository';
import { UsersSaService } from '../../../../users/application/sa/users.sa.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class SetNewPasswordUseCaseCommand {
  constructor(public newPassword: string, public recoveryCode: string) {}
}
@CommandHandler(SetNewPasswordUseCaseCommand)
export class SetNewPasswordUseCase
  implements ICommandHandler<SetNewPasswordUseCaseCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private usersService: UsersSaService,
  ) {}

  async execute({ newPassword, recoveryCode }: SetNewPasswordUseCaseCommand) {
    const user: UserDocument | null =
      await this.usersRepository.getUserByPasswordRecoveryCode(recoveryCode);

    if (!user) return false;

    const hashedPassword = await this.usersService.hashPassword(newPassword);

    user.setNewPassword(hashedPassword);

    await this.usersRepository.save(user);

    return true;
  }
}
