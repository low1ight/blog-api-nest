import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schemas/blog.schema';
import { Model, Types } from 'mongoose';

Injectable();
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  async getUsers() {
    return this.blogModel.find();
  }

  async getUserById(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;

    return this.blogModel.findById(id);
  }
}
