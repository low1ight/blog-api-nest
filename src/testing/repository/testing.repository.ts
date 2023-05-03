import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../posts/schemas/post.schema';
import { Model } from 'mongoose';
import { Blog } from '../../blogs/schemas/blog.schema';
import { User } from '../../users/schemas/user.schema';
import { Comment } from '../../comments/schemas/comment.schema';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async deleteAllData() {
    await this.postModel.deleteMany();
    await this.blogModel.deleteMany();
    await this.commentModel.deleteMany();
    await this.userModel.deleteMany();
  }
}
