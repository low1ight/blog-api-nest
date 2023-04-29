import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../schemas/blog.schema';
import { Model, Types } from 'mongoose';
import {
  blogObjToViewModel,
  blogsArrToViewModel,
} from './mappers/toBlogViewModel';
import { BlogDbType } from '../types/Blog.db.type';

export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  async getUsers() {
    const blogs: BlogDbType[] = await this.blogModel.find();
    return blogsArrToViewModel(blogs);
  }

  async getUserById(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;

    const user: BlogDbType | null = await this.blogModel.findById(id);
    if (!user) return null;

    return blogObjToViewModel(user);
  }
}
