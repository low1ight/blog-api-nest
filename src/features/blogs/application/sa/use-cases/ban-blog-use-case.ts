import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../repository/blogs.repository';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';
import { PostsRepository } from '../../../../posts/repository/posts.repository';

export class BanBlogUseCaseCommand {
  constructor(public id: string, public isBanned: boolean) {}
}
@CommandHandler(BanBlogUseCaseCommand)
export class BanBlogUseCase implements ICommandHandler<BanBlogUseCaseCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
  ) {}
  async execute({ id, isBanned }: BanBlogUseCaseCommand) {
    const blog = await this.blogsRepository.getBlogById(id);

    if (!blog) return new CustomResponse(false, CustomResponseEnum.badRequest);

    if (blog.blogBanInfo.isBanned !== isBanned) {
      blog.setBanStatus(isBanned);
      await this.postsRepository.setBlogBanStatusForAllPosts(id, isBanned);
      await this.blogsRepository.save(blog);
    }
    return new CustomResponse(true);
  }
}
