import { BlogsRepository } from '../../../repository/blogs.repository';
import { UsersRepository } from '../../../../users/repositories/Users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class BindUserToBlogUseCaseCommand {
  constructor(public blogId: string, public userId: string) {}
}
@CommandHandler(BindUserToBlogUseCaseCommand)
export class BindUserToBlogUseCase
  implements ICommandHandler<BindUserToBlogUseCaseCommand>
{
  constructor(
    private blogsRepository: BlogsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ blogId, userId }: BindUserToBlogUseCaseCommand) {
    const blog = await this.blogsRepository.getBlogById(blogId);
    const user = await this.usersRepository.getUserById(userId);

    if (!blog || !user) return false;

    if (!blog.isCanBeBoundToUser()) return false;

    blog.bindToUser(userId, user.userData.login);

    await this.blogsRepository.save(blog);

    return true;
  }
}
