import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModel } from '../schemas/post.schema';
import { Types } from 'mongoose';
import { CreateUpdateBlogPostDto } from '../dto/CreateUpdateBlogPostDto';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: PostModel) {}

  async createPost(dto: CreateUpdateBlogPostDto): Promise<PostDocument> {
    return this.postModel.createPost(dto, this.postModel);
  }

  async getPostById(id: string): Promise<PostDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.postModel.findById(id);
  }

  async save(post: PostDocument): Promise<string> {
    const savedPost: PostDocument = await post.save();
    return savedPost._id.toString();
  }

  async isPostExist(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;

    const post = await this.postModel.exists({ _id: id });

    return !!post;
  }

  async deletePost(id: string): Promise<boolean> {
    const deleteResult = await this.postModel.deleteOne({ _id: id });
    return deleteResult.deletedCount === 1;
  }

  async setBlogBanStatusForAllPosts(blogId: string, isBlogBanned: boolean) {
    await this.postModel.updateMany(
      { blogId: new Types.ObjectId(blogId) },
      {
        isBlogOfThisPostBanned: isBlogBanned,
      },
    );
  }
}
