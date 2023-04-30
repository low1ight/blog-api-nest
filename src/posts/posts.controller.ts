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

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postQueryRepository: PostsQueryRepository,
    private readonly postService: PostsService,
  ) {}

  @Get()
  async getBlogs(@Query() query: PostInputQueryType) {
    const postQuery = postQueryMapper(query);

    return await this.postQueryRepository.getPosts(postQuery);
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
}
