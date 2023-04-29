import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../schemas/blog.schema';
import { Model, Types } from 'mongoose';
import {
  blogObjToViewModel,
  blogsArrToViewModel,
} from './mappers/toBlogViewModel';

export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  async getUsers() {
    const blogs: BlogDocument[] = await this.blogModel.find();
    return blogsArrToViewModel(blogs);
  }

  async getUserById(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;

    const user: BlogDocument | null = await this.blogModel.findById(id);
    if (!user) return null;

    return blogObjToViewModel(user);
  }
}
