import { UpdateBlogDto } from '../../../dto/UpdateBlogDto';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { BlogsBloggerService } from '../blogs.blogger.service';
import { BlogsRepository } from '../../../repository/blogs.repository';

export class UpdateBlogUseCaseCommand {
  constructor(
    public dto: UpdateBlogDto,
    public blogId: string,
    public currentUserId: string,
  ) {}
}

export class UpdateBlogUseCase {
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

    const blog = gettingBlogResult.content;

    gettingBlogResult.content.updateData(dto);

    await this.blogsRepository.save(blog);

    return new CustomResponse(true);
  }
}
