import { UsersSaService } from '../users.sa.service';
import { UsersRepository } from '../../../repositories/Users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteUserUseCaseCommand {
  constructor(public id: string) {}
}
@CommandHandler(DeleteUserUseCaseCommand)
export class DeleteUserUseCase
  implements ICommandHandler<DeleteUserUseCaseCommand>
{
  constructor(
    private readonly usersService: UsersSaService,
    private readonly usersRepository: UsersRepository,
  ) {}
  async execute({ id }: DeleteUserUseCaseCommand) {
    const isUserExist = await this.usersRepository.isUserExist(id);

    if (!isUserExist) return false;

    return await this.usersRepository.deleteUserById(id);
  }
}
