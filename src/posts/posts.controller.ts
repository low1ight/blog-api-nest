import {
  Body,
  Controller,
  Delete,
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
} from '../utils/query-mappers/post-query-mapper';
import { PostsQueryRepository } from './repository/posts.query.repository';
import { PostsService } from './posts.service';
import { CreatePostInputDto } from './dto/CreatePostInputDto';
import { UpdatePostInputDto } from './dto/UpdatePostInputDto';
import { CustomResponse } from '../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../utils/customResponse/CustomResponseEnum';
import {
  CommentInputQueryType,
  commentQueryMapper,
} from '../utils/query-mappers/comment-query-mapper';
import { CommentsQueryRepository } from '../comments/repository/comments.query.repository';
import { CreateCommentForPostDto } from './dto/CreateCommentForPostDto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { CommentsService } from '../comments/comments.service';
import { CurrentUser } from '../common/decorators/current.user.decorator';
import { LikeInputDto } from '../likes/dto/LikeInputDto';
import { OptionalJwtAuthGuard } from '../auth/guards/optional.jwt.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postQueryRepository: PostsQueryRepository,
    private readonly postService: PostsService,
    private readonly commentQueryRepository: CommentsQueryRepository,
    private readonly commentsService: CommentsService,
  ) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async getBlogs(@Query() query: PostInputQueryType, @CurrentUser() user) {
    const postQuery = postQueryMapper(query);
    const currentUserId = user?.id || null;

    return await this.postQueryRepository.getPosts(postQuery, currentUserId);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string, @CurrentUser() user) {
    const currentUserId = user?.id || null;
    const post = await this.postQueryRepository.getPostById(id, currentUserId);
    if (!post)
      return CustomResponse.throwHttpException(CustomResponseEnum.notExist);
    return post;
  }
  @Post()
  @HttpCode(201)
  async createPost(@Body() dto: CreatePostInputDto) {
    return await this.postService.createPost(dto);
  }

  @Put(':id')
  @HttpCode(204)
  async updatePost(@Body() dto: UpdatePostInputDto, @Param('id') id: string) {
    const result: CustomResponse<null> = await this.postService.updatePost(
      dto,
      id,
    );

    if (!result.isSuccess)
      return CustomResponse.throwHttpException(result.errStatusCode);

    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string) {
    const deleteResult = await this.postService.deletePost(id);
    if (!deleteResult)
      return CustomResponse.throwHttpException(CustomResponseEnum.notExist);
    return;
  }

  @Get(':id/comments')
  async getPostComments(
    @Param('id') id: string,
    @Query() inputQuery: CommentInputQueryType,
  ) {
    const commentQuery = commentQueryMapper(inputQuery);

    return await this.commentQueryRepository.getPostCommentsWithPaginator(
      commentQuery,
      id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async createCommentForPost(
    @Param('id') id: string,
    @Body() dto: CreateCommentForPostDto,
    @CurrentUser() user: { id: string; userName: string },
  ) {
    const createdCommentId: string | null =
      await this.commentsService.createComment(
        dto.content,
        id,
        user.id,
        user.userName,
      );
    if (!createdCommentId)
      CustomResponse.throwHttpException(CustomResponseEnum.badRequest);
    const comment = await this.commentQueryRepository.getCommentById(
      createdCommentId,
    );
    if (!comment)
      CustomResponse.throwHttpException(CustomResponseEnum.notExist);
    return comment;
  }
  @UseGuards(JwtAuthGuard)
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

    if (!isLikeSet)
      CustomResponse.throwHttpException(CustomResponseEnum.notExist);

    return;
  }
}
