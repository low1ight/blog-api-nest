import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../schemas/post.schema';
import { Model, Types } from 'mongoose';
import { CreatePostDto } from '../dto/CreatePostDto';
import { createdPostToViewModel } from './mappers/toPostViewModel';
import { PostViewModel } from '../types/post.types';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(dto: CreatePostDto): Promise<PostViewModel> {
    const createdPost = new this.postModel(dto);

    const post: PostDocument = await createdPost.save();

    return createdPostToViewModel(post);
  }

  async getPostById(id: string): Promise<PostDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.postModel.findById(id);
  }

  async save(post: PostDocument): Promise<PostDocument> {
    return post.save();
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
}
