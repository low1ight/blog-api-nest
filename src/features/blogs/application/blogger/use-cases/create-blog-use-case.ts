import { CreateBlogDto } from '../../../dto/CreateBlogDto';
import { AuthUserData } from '../../../../common/types/AuthUserData';
import { BlogsRepository } from '../../../repository/blogs.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateBlogUseCaseCommand {
  constructor(public dto: CreateBlogDto, public authUserData: AuthUserData) {}
}
@CommandHandler(CreateBlogUseCaseCommand)
export class CreateBlogUseCase
  implements ICommandHandler<CreateBlogUseCaseCommand>
{
  constructor(private blogRepository: BlogsRepository) {}
  async execute({
    dto,
    authUserData,
  }: CreateBlogUseCaseCommand): Promise<string> {
    const blog = await this.blogRepository.createBlog(dto, authUserData);

    //save and return created userId
    return await this.blogRepository.save(blog);
  }
}
