import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModel } from '../entities/blog.entity';
import { Model, Types } from 'mongoose';
import { CreateBlogDto } from '../dto/CreateBlogDto';
import { blogObjToViewModel } from './mappers/toBlogViewModel';
import { BlogViewModel } from '../types/Blog.view.model';

Injectable();
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModel) {}

  async createBlog(
    dto: CreateBlogDto,
    currentUserId: string,
  ): Promise<BlogDocument> {
    return await this.blogModel.createBlogForUser(
      dto,
      currentUserId,
      this.blogModel,
    );
  }

  async save(blog: BlogDocument): Promise<string> {
    const savedBlog = await blog.save();
    return savedBlog._id.toString();
  }

  async deleteBlog(id: string) {
    if (!Types.ObjectId.isValid(id)) return false;

    const deleteResult = await this.blogModel.deleteOne({ _id: id }).exec();

    return deleteResult.deletedCount > 0;
  }

  async getBlogById(id: string): Promise<BlogDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    return this.blogModel.findById(id);
  }

  async getBlogNameById(id: string): Promise<string | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const blog = await this.blogModel.findById(id);

    //return blog name or null
    return blog && blog.name;
  }

  async isBlogExist(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return null;

    const result = await this.blogModel.exists({ _id: new Types.ObjectId(id) });

    return !!result;
  }
}
