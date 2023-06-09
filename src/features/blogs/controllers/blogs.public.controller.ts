import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { BlogsPublicService } from '../application/blogs.public.service';
import { BlogsQueryRepository } from '../repository/blogs.query.repository';
import { BlogViewModel } from '../types/Blog.view.model';
import { CustomResponseEnum } from '../../utils/customResponse/CustomResponseEnum';
import {
  BlogInputQueryType,
  blogQueryMapper,
} from '../../utils/query-mappers/blog-query-mapper';
import { PostsQueryRepository } from '../../posts/repository/posts.query.repository';
import {
  PostInputQueryType,
  postQueryMapper,
} from '../../utils/query-mappers/post-query-mapper';
import { PostsPublicService } from '../../posts/application/posts.public.service';
import { BlogsRepository } from '../repository/blogs.repository';
import { Exceptions } from '../../utils/throwException';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional.jwt.guard';
import { CurrentUser } from '../../common/decorators/current.user.decorator';

@Controller('blogs')
export class BlogsPublicController {
  constructor(
    private readonly blogsService: BlogsPublicService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsPublicService,
    private readonly blogRepository: BlogsRepository,
  ) {}
  @Get()
  async getBlogs(@Query() query: BlogInputQueryType) {
    const blogQuery = blogQueryMapper(query);

    return await this.blogsQueryRepository.getBlogs(blogQuery);
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    const blog: BlogViewModel | null =
      await this.blogsQueryRepository.getBlogById(id);

    if (!blog) Exceptions.throwHttpException(CustomResponseEnum.notExist);

    return blog;
  }

  @Get(':id/posts')
  @UseGuards(OptionalJwtAuthGuard)
  async getPostsForBlog(
    @Param('id') id: string,
    @Query() query: PostInputQueryType,
    @CurrentUser() user,
  ) {
    const isBlogExist = await this.blogRepository.isBlogExist(id);

    if (!isBlogExist)
      Exceptions.throwHttpException(CustomResponseEnum.notExist);

    const currentUserId = user?.id || null;

    const postQuery = postQueryMapper(query);
    return await this.postsQueryRepository.getPostsForBlog(
      postQuery,
      id,
      currentUserId,
    );
  }
}
