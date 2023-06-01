import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../repository/posts.repository';
import { CreatePostInputDto } from '../dto/CreatePostInputDto';
import { BlogsRepository } from '../../blogs/repository/blogs.repository';
import { UpdatePostInputDto } from '../dto/UpdatePostInputDto';
import { CustomResponse } from '../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../utils/customResponse/CustomResponseEnum';
import { PostDocument } from '../schemas/post.schema';
import { BlogDocument } from '../../blogs/entities/blog.entity';

@Injectable()
export class PostsBloggerService {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly blogRepository: BlogsRepository, //private readonly likeService: LikesService,
  ) {}

  async createPost(
    createPostInputData: CreatePostInputDto,
    blogId: string,
    currentUserId: string,
  ): Promise<CustomResponse<any>> {
    const createPostDtoResult: CustomResponse<any> = await this.createDto(
      createPostInputData,
      blogId,
      currentUserId,
    );

    if (!createPostDtoResult.isSuccess) return createPostDtoResult;

    const post = await this.postRepository.createPost(
      createPostDtoResult.content,
    );

    const postId: string = await this.postRepository.save(post);

    return new CustomResponse(true, null, postId);
  }

  async updatePost(
    updatePostInputData: UpdatePostInputDto,
    blogId: string,
    postId: string,
    currentUserId: string,
  ) {
    //get post
    const post: PostDocument | null = await this.postRepository.getPostById(
      postId,
    );

    //if blog or post don't exist return custom response with not exist status
    if (!post) return new CustomResponse(false, CustomResponseEnum.notExist);
    //if blog id invalid return null
    const creatingUpdatePostDtoResult: CustomResponse<any> =
      await this.createDto(updatePostInputData, blogId, currentUserId);

    if (!creatingUpdatePostDtoResult.isSuccess)
      return creatingUpdatePostDtoResult;

    post.updateData(creatingUpdatePostDtoResult.content);

    await this.postRepository.save(post);

    return new CustomResponse(true);
  }

  async deletePost(blogId: string, postId: string, currentUserId: string) {
    //get blog and check is blog exist and isCurrent user owner
    const getBlogResult: CustomResponse<BlogDocument | null> =
      await this.getBlogAndCheckIsUserOwner(blogId, currentUserId);

    if (!getBlogResult.isSuccess) return getBlogResult;
    // check is post exist before deleting
    const isPostExist = await this.postRepository.isPostExist(postId);

    if (!isPostExist)
      return new CustomResponse(false, CustomResponseEnum.notExist);

    await this.postRepository.deletePost(postId);

    return new CustomResponse(true);
  }

  async createDto(
    dto: CreatePostInputDto | UpdatePostInputDto,
    blogId: string,
    currentUserId: string,
  ) {
    //in blog exist, get blog name

    const getBlogResult: CustomResponse<BlogDocument | null> =
      await this.getBlogAndCheckIsUserOwner(blogId, currentUserId);

    if (!getBlogResult.isSuccess) return getBlogResult;

    //create correct dto with blog name and return
    const postObj = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blogId,
      blogName: getBlogResult.content.name,
    };

    return new CustomResponse(true, null, postObj);
  }

  async getBlogAndCheckIsUserOwner(
    blogId: string,
    currentUserId: string,
  ): Promise<CustomResponse<null | BlogDocument>> {
    const blog = await this.blogRepository.getBlogById(blogId);

    if (!blog)
      return new CustomResponse(false, CustomResponseEnum.notExist, null);

    if (blog.blogOwnerInfo.userId.toString() !== currentUserId)
      return new CustomResponse(false, CustomResponseEnum.forbidden, null);

    return new CustomResponse(true, null, blog);
  }
}
