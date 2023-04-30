import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../schemas/post.schema';
import { Model, Types } from 'mongoose';
import { CreatePostDto } from '../dto/CreatePostDto';
import { createdPostToViewModel } from './mappers/toPostViewModel';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(dto: CreatePostDto) {
    const createdPost = new this.postModel(dto);

    const post: PostDocument = await createdPost.save();

    return createdPostToViewModel(post);
  }

  async getPostById(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.postModel.findById(id);
  }

  async save(post: PostDocument) {
    return post.save();
  }
}
