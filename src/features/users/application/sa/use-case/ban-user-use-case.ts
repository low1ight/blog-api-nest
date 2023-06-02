import { BanUserDto } from '../../../dto/BanUserDto';
import { UserDocument } from '../../../entities/user.entity';
import { DevicesRepository } from '../../../../devices/repository/devices.repository';
import { UsersRepository } from '../../../repositories/Users.repository';
import { CommentsRepository } from '../../../../comments/repository/comments.repository';
import { LikeRepository } from '../../../../likes/repository/like.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class BanUserUseCaseCommand {
  constructor(public id: string, public dto: BanUserDto) {}
}

@CommandHandler(BanUserUseCaseCommand)
export class BanUserUseCase implements ICommandHandler<BanUserUseCaseCommand> {
  constructor(
    private readonly devicesRepository: DevicesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly likesRepository: LikeRepository,
  ) {}
  async execute({ id, dto }: BanUserUseCaseCommand) {
    //get user and set new ban status and ban reason
    const user: UserDocument | null = await this.usersRepository.getUserById(
      id,
    );
    if (!user) return false;

    if (dto.isBanned) {
      user.banUser(dto.banReason);
      await this.devicesRepository.deleteALlUserDevices(id);
    } else {
      user.unbanUser();
    }

    await this.usersRepository.save(user);

    //ban/unban all users comments and likes
    await this.commentsRepository.setNewBanStatus(id, dto.isBanned);
    await this.likesRepository.setNewBanStatus(id, dto.isBanned);

    return true;
  }
}
