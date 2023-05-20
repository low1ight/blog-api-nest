import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../posts/schemas/post.schema';
import { Model } from 'mongoose';
import { Blog } from '../../blogs/schemas/blog.schema';
import { User } from '../../users/schemas/user.schema';
import { Comment } from '../../comments/schemas/comment.schema';
import { Device } from '../../devices/schemas/device.schema';
import { Like } from '../../likes/schemas/like.schema';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Device.name) private deviceModel: Model<Device>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
  ) {}

  async deleteAllData() {
    await this.postModel.deleteMany();
    await this.blogModel.deleteMany();
    await this.commentModel.deleteMany();
    await this.userModel.deleteMany();
    await this.deviceModel.deleteMany();
    await this.likeModel.deleteMany();
  }
}
