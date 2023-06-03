import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { BlogsBloggerService } from '../blogs.blogger.service';
import { BlogsRepository } from '../../../repository/blogs.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteBlogUseCaseCommand {
  constructor(public blogId: string, public currentUserId: string) {}
}

@CommandHandler(DeleteBlogUseCaseCommand)
export class DeleteBlogUseCase
  implements ICommandHandler<DeleteBlogUseCaseCommand>
{
  constructor(
    protected blogsService: BlogsBloggerService,
    protected blogsRepository: BlogsRepository,
  ) {}

  async execute({
    blogId,
    currentUserId,
  }: DeleteBlogUseCaseCommand): Promise<CustomResponse<any>> {
    const gettingBlogResult = await this.blogsService.getBlogAndCheckOwnership(
      blogId,
      currentUserId,
    );

    if (!gettingBlogResult.isSuccess) return gettingBlogResult;

    await this.blogsRepository.deleteBlog(blogId);

    return new CustomResponse(true);
  }
}
