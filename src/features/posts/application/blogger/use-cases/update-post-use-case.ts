import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { PostsRepository } from '../../../repository/posts.repository';
import { PostsBloggerService } from '../posts.blogger.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostDocument } from '../../../schemas/post.schema';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';
import { UpdatePostInputDto } from '../../../dto/UpdatePostInputDto';

export class UpdatePostUseCaseCommand {
  constructor(
    public updatePostInputData: UpdatePostInputDto,
    public blogId: string,
    public postId: string,
    public currentUserId: string,
  ) {}
}
@CommandHandler(UpdatePostUseCaseCommand)
export class UpdatePostUseCase
  implements ICommandHandler<UpdatePostUseCaseCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private postsService: PostsBloggerService,
  ) {}

  async execute({
    updatePostInputData,
    blogId,
    postId,
    currentUserId,
  }: UpdatePostUseCaseCommand) {
    //get post
    const post: PostDocument | null = await this.postsRepository.getPostById(
      postId,
    );

    //if blog or post don't exist return custom response with not exist status
    if (!post) return new CustomResponse(false, CustomResponseEnum.notExist);
    //if blog id invalid return null
    const creatingUpdatePostDtoResult: CustomResponse<any> =
      await this.postsService.createDto(
        updatePostInputData,
        blogId,
        currentUserId,
      );

    if (!creatingUpdatePostDtoResult.isSuccess)
      return creatingUpdatePostDtoResult;

    post.updateData(creatingUpdatePostDtoResult.content);

    await this.postsRepository.save(post);

    return new CustomResponse(true);
  }
}
