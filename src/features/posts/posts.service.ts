import { Injectable } from '@nestjs/common';
import { PostsRepository } from './repository/posts.repository';
import { CreatePostInputDto } from './dto/CreatePostInputDto';
import { BlogsRepository } from '../blogs/repository/blogs.repository';

import { CreatePostDto } from './dto/CreatePostDto';
import { UpdatePostInputDto } from './dto/UpdatePostInputDto';
import { UpdatePostDto } from './dto/UpdatePostDto';
import { CustomResponse } from '../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../utils/customResponse/CustomResponseEnum';
import { PostDocument } from './schemas/post.schema';
import { LikesService } from '../likes/likes.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly blogRepository: BlogsRepository,
    private readonly likeService: LikesService,
  ) {}

  async createPost(createPostInputData: CreatePostInputDto) {
    const createPostDto: CreatePostDto | null = await this.createDto(
      createPostInputData,
    );

    if (!createPostDto) return null;

    return await this.postRepository.createPost(createPostDto);
  }

  async updatePost(
    updatePostInputData: UpdatePostInputDto,
    postId: string,
  ): Promise<CustomResponse<null>> {
    //get post
    const post: PostDocument | null = await this.postRepository.getPostById(
      postId,
    );

    if (!post) return new CustomResponse(false, CustomResponseEnum.notExist);
    //if blog id invalid return null
    const updatePostDto: UpdatePostDto | null = await this.createDto(
      updatePostInputData,
    );

    if (!updatePostDto)
      return new CustomResponse(false, CustomResponseEnum.badRequest);

    post.updateData(updatePostDto);

    await this.postRepository.save(post);

    return new CustomResponse(true);
  }

  async createDto(dto: CreatePostInputDto | UpdatePostInputDto) {
    //in blog exist, get blog name
    const blogName = await this.blogRepository.getBlogNameById(dto.blogId);

    if (!blogName) return null;

    //create correct dto with blog name and return
    return {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blogName,
    };
  }

  async setLikeStatus(
    likeStatus: string,
    targetId: string,
    userId: string,
    userLogin: string,
  ): Promise<boolean> {
    const isPostExist = await this.postRepository.isPostExist(targetId);
    if (!isPostExist) return false;

    await this.likeService.setLikeStatus(
      { likeStatus, targetId, userId, userLogin },
      'post',
    );

    return true;
  }

  async checkIsPostExistById(id: string) {
    return await this.postRepository.isPostExist(id);
  }

  async deletePost(id: string) {
    const isPostExist: boolean = await this.postRepository.isPostExist(id);

    if (!isPostExist) return false;

    return this.postRepository.deletePost(id);
  }
}
