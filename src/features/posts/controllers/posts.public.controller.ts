import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  PostInputQueryType,
  postQueryMapper,
} from '../../utils/query-mappers/post-query-mapper';
import { PostsQueryRepository } from '../repository/posts.query.repository';
import { PostsPublicService } from '../application/posts.public.service';
import { CustomResponseEnum } from '../../utils/customResponse/CustomResponseEnum';
import {
  CommentInputQueryType,
  commentQueryMapper,
} from '../../utils/query-mappers/comment-query-mapper';
import { CommentsQueryRepository } from '../../comments/repository/comments.query.repository';
import { CommentDto } from '../../comments/dto/CommentDto';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { CurrentUser } from '../../common/decorators/current.user.decorator';
import { LikeInputDto } from '../../likes/dto/LikeInputDto';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional.jwt.guard';
import { Exceptions } from '../../utils/throwException';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCommentUseCaseCommand } from '../../comments/application/public/use-cases/create-comment-use-case';
import { CustomResponse } from '../../utils/customResponse/CustomResponse';

@Controller('posts')
export class PostsPublicController {
  constructor(
    private readonly postQueryRepository: PostsQueryRepository,
    private readonly postService: PostsPublicService,
    private readonly commentQueryRepository: CommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async getPosts(@Query() query: PostInputQueryType, @CurrentUser() user) {
    const postQuery = postQueryMapper(query);
    const currentUserId = user?.id || null;

    return await this.postQueryRepository.getPosts(postQuery, currentUserId);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getPostById(@Param('id') id: string, @CurrentUser() user) {
    const currentUserId = user?.id || null;
    const post = await this.postQueryRepository.getPostById(id, currentUserId);
    if (!post)
      return Exceptions.throwHttpException(CustomResponseEnum.notExist);
    return post;
  }

  @Get(':id/comments')
  @UseGuards(OptionalJwtAuthGuard)
  async getPostComments(
    @Param('id') id: string,
    @Query() inputQuery: CommentInputQueryType,
    @CurrentUser() user,
  ) {
    const commentQuery = commentQueryMapper(inputQuery);
    const currentUserId = user?.id || null;

    const isPostExist = await this.postService.checkIsPostExistById(id);
    if (!isPostExist)
      return Exceptions.throwHttpException(CustomResponseEnum.notExist);

    return await this.commentQueryRepository.getPostCommentsWithPaginator(
      commentQuery,
      id,
      currentUserId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async createCommentForPost(
    @Param('id') id: string,
    @Body() dto: CommentDto,
    @CurrentUser() user: { id: string; userName: string },
  ) {
    const creatingCommentResponse: CustomResponse<null | string> =
      await this.commandBus.execute(
        new CreateCommentUseCaseCommand(
          dto.content,
          id,
          user.id,
          user.userName,
        ),
      );
    if (!creatingCommentResponse.isSuccess)
      Exceptions.throwHttpException(creatingCommentResponse.errStatusCode);
    const comment = await this.commentQueryRepository.getCommentById(
      creatingCommentResponse.content,
      id,
    );
    if (!comment) Exceptions.throwHttpException(CustomResponseEnum.notExist);
    return comment;
  }
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':id/like-status')
  async setLikeStatus(
    @Param('id') id: string,
    @Body() dto: LikeInputDto,
    @CurrentUser() user: { id: string; userName: string },
  ) {
    const isLikeSet = await this.postService.setLikeStatus(
      dto.likeStatus,
      id,
      user.id,
      user.userName,
    );

    if (!isLikeSet) Exceptions.throwHttpException(CustomResponseEnum.notExist);

    return;
  }
}
