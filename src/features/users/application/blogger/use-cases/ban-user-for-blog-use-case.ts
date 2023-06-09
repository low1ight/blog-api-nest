import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUserForBlog } from '../../../dto/BanUserForBlog';
import { BlogsBloggerService } from '../../../../blogs/application/blogger/blogs.blogger.service';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { BlogDocument } from '../../../../blogs/entities/blog.entity';
import { BlogsRepository } from '../../../../blogs/repository/blogs.repository';
import { UsersRepository } from '../../../repositories/Users.repository';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';

export class BanUserForBlogUseCaseCommand {
  constructor(
    public dto: BanUserForBlog,
    public currentUserId: string,
    public userIdForBan: string,
  ) {}
}

@CommandHandler(BanUserForBlogUseCaseCommand)
export class BanUserForBlogUseCase
  implements ICommandHandler<BanUserForBlogUseCaseCommand>
{
  constructor(
    private blogsService: BlogsBloggerService,
    private blogsRepository: BlogsRepository,
    private usersRepository: UsersRepository,
  ) {}
  async execute({
    dto,
    currentUserId,
    userIdForBan,
  }: BanUserForBlogUseCaseCommand) {
    //you cant ban yourself
    //if (currentUserId === userIdForBan)
    //  return new CustomResponse(false, CustomResponseEnum.badRequest);

    const isUserExist = await this.usersRepository.isUserExist(userIdForBan);

    if (!isUserExist)
      return new CustomResponse(false, CustomResponseEnum.notExist);
    //get blog and check is blog belong to current user
    const getBlogResult: CustomResponse<null | BlogDocument> =
      await this.blogsService.getBlogAndCheckOwnership(
        dto.blogId,
        currentUserId,
      );

    //if user don't exist or getting user validation failed return custom response with err status code
    if (!getBlogResult.isSuccess) return getBlogResult;

    const blog = getBlogResult.content;

    const isUserAlreadyBannedInThisBlog = blog.isUserInBanList(userIdForBan);

    //if we try to ban already banned user
    //or unban not banned user return success
    if (isUserAlreadyBannedInThisBlog !== dto.isBanned) {
      if (dto.isBanned) {
        blog.addUserToBanList(userIdForBan, dto.banReason);
        await this.blogsRepository.save(blog);
      } else {
        await this.blogsRepository.removeUserFromBanList(
          dto.blogId,
          userIdForBan,
        );
      }
    }
    return new CustomResponse(true);
  }
}
