import { UpdateBlogDto } from '../../../dto/UpdateBlogDto';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { BlogsBloggerService } from '../blogs.blogger.service';
import { BlogsRepository } from '../../../repository/blogs.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UpdateBlogUseCaseCommand {
  constructor(
    public dto: UpdateBlogDto,
    public blogId: string,
    public currentUserId: string,
  ) {}
}
@CommandHandler(UpdateBlogUseCaseCommand)
export class UpdateBlogUseCase
  implements ICommandHandler<UpdateBlogUseCaseCommand>
{
  constructor(
    private blogsService: BlogsBloggerService,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({
    dto,
    blogId,
    currentUserId,
  }: UpdateBlogUseCaseCommand): Promise<CustomResponse<any>> {
    const gettingBlogResult = await this.blogsService.getBlogAndCheckOwnership(
      blogId,
      currentUserId,
    );

    if (!gettingBlogResult.isSuccess) return gettingBlogResult;

    const blog = gettingBlogResult.content;

    blog.updateData(dto);

    await this.blogsRepository.save(blog);

    return new CustomResponse(true);
  }
}
