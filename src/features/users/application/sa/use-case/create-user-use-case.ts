import { CreateUserDto } from '../../../dto/CreateUserDto';
import { UsersSaService } from '../users.sa.service';
import { UsersRepository } from '../../../repositories/Users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateUserUseCaseCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserUseCaseCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserUseCaseCommand>
{
  constructor(
    private userService: UsersSaService,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ dto }: CreateUserUseCaseCommand) {
    dto.password = await this.userService.hashPassword(dto.password);

    return await this.usersRepository.createConfirmedUser(dto);
  }
}
