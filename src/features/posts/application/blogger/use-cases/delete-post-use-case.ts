import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { BlogDocument } from '../../../../blogs/entities/blog.entity';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';
import { PostsBloggerService } from '../posts.blogger.service';
import { PostsRepository } from '../../../repository/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeletePostUseCaseCommand {
  constructor(
    public blogId: string,
    public postId: string,
    public currentUserId: string,
  ) {}
}
@CommandHandler(DeletePostUseCaseCommand)
export class DeletePostUseCase
  implements ICommandHandler<DeletePostUseCaseCommand>
{
  constructor(
    private postsService: PostsBloggerService,
    private postsRepository: PostsRepository,
  ) {}

  async execute({ blogId, postId, currentUserId }: DeletePostUseCaseCommand) {
    //get blog and check is blog exist and isCurrent user owner
    const getBlogResult: CustomResponse<BlogDocument | null> =
      await this.postsService.getBlogAndCheckIsUserOwner(blogId, currentUserId);

    if (!getBlogResult.isSuccess) return getBlogResult;
    // check is post exist before deleting
    const isPostExist = await this.postsRepository.isPostExist(postId);

    if (!isPostExist)
      return new CustomResponse(false, CustomResponseEnum.notExist);

    await this.postsRepository.deletePost(postId);

    return new CustomResponse(true);
  }
}
