import { CreatePostInputDto } from '../../../dto/CreatePostInputDto';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { PostsRepository } from '../../../repository/posts.repository';
import { PostsBloggerService } from '../posts.blogger.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreatePostUseCaseCommand {
  constructor(
    public createPostInputData: CreatePostInputDto,
    public blogId: string,
    public currentUserId: string,
  ) {}
}
@CommandHandler(CreatePostUseCaseCommand)
export class CreatePostUseCase
  implements ICommandHandler<CreatePostUseCaseCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private postsService: PostsBloggerService,
  ) {}

  async execute({
    createPostInputData,
    blogId,
    currentUserId,
  }: CreatePostUseCaseCommand): Promise<CustomResponse<any>> {
    const createPostDtoResult: CustomResponse<any> =
      await this.postsService.createDto(
        createPostInputData,
        blogId,
        currentUserId,
      );

    if (!createPostDtoResult.isSuccess) return createPostDtoResult;

    const post = await this.postsRepository.createPost(
      createPostDtoResult.content,
    );

    const postId: string = await this.postsRepository.save(post);

    return new CustomResponse(true, null, postId);
  }
}
