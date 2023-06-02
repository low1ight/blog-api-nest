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
import { BlogsQueryRepository } from '../repository/blogs.query.repository';
import { CreateBlogDto } from '../dto/CreateBlogDto';
import { UpdateBlogDto } from '../dto/UpdateBlogDto';
import { CustomResponseEnum } from '../../utils/customResponse/CustomResponseEnum';
import {
  BlogInputQueryType,
  blogQueryMapper,
} from '../../utils/query-mappers/blog-query-mapper';
import { PostsQueryRepository } from '../../posts/repository/posts.query.repository';

import { PostViewModel } from '../../posts/types/post.types';
import { Exceptions } from '../../utils/throwException';
import { CurrentUser } from '../../common/decorators/current.user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { BlogsBloggerService } from '../application/blogs.blogger.service';
import { CustomResponse } from '../../utils/customResponse/CustomResponse';
import { PostsBloggerService } from '../../posts/application/posts.blogger.service';
import { CreatePostInputDto } from '../../posts/dto/CreatePostInputDto';
import { UpdatePostInputDto } from '../../posts/dto/UpdatePostInputDto';
import { AuthUserData } from '../../common/types/AuthUserData';

@Controller('blogger/blogs')
export class BlogsBloggerController {
  constructor(
    private readonly blogsService: BlogsBloggerService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsBloggerService,
  ) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async getBlogs(@Query() query: BlogInputQueryType, @CurrentUser() user) {
    const blogQuery = blogQueryMapper(query);

    return await this.blogsQueryRepository.getBlogsWitchCurrentUserIsOwner(
      blogQuery,
      user.id,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async createBlog(
    @Body() dto: CreateBlogDto,
    @CurrentUser() user: AuthUserData,
  ) {
    const createdBlogId: string = await this.blogsService.createBlog(dto, user);

    return await this.blogsQueryRepository.getBlogById(createdBlogId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async updateBlog(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @CurrentUser() user,
  ) {
    const result: CustomResponse<any> = await this.blogsService.updateBlog(
      dto,
      id,
      user.id,
    );

    if (!result.isSuccess) Exceptions.throwHttpException(result.errStatusCode);

    return;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string, @CurrentUser() user) {
    const result = await this.blogsService.deleteBlog(id, user.id);

    if (!result) Exceptions.throwHttpException(CustomResponseEnum.notExist);

    return;
  }
  //posts for blog

  @Post(':id/posts')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async createPostForBlog(
    @Body() dto: CreatePostInputDto,
    @Param('id') id: string,
    @CurrentUser() user,
  ) {
    //create post and return created post id
    const response: CustomResponse<null | string> =
      await this.postsService.createPost(dto, id, user.id);
    if (!response.isSuccess)
      Exceptions.throwHttpException(response.errStatusCode);

    //get created post by id
    const post: PostViewModel | null =
      await this.postsQueryRepository.getPostById(response.content, user.id);

    if (!post) Exceptions.throwHttpException(CustomResponseEnum.notExist);

    return post;
  }

  @Put(':blogId/posts/:postId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async updatePostForBlog(
    @Body() dto: UpdatePostInputDto,
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @CurrentUser() user,
  ) {
    //create post and return created post id
    const response: CustomResponse<any> = await this.postsService.updatePost(
      dto,
      blogId,
      postId,
      user.id,
    );
    if (!response.isSuccess)
      Exceptions.throwHttpException(response.errStatusCode);
  }

  @Delete(':blogId/posts/:postId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async deletePostForBlog(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @CurrentUser() user,
  ) {
    //create post and return created post id
    const response: CustomResponse<any> = await this.postsService.deletePost(
      blogId,
      postId,
      user.id,
    );
    if (!response.isSuccess)
      Exceptions.throwHttpException(response.errStatusCode);
  }
}