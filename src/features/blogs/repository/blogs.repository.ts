import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModel } from '../entities/blog.entity';
import { Types } from 'mongoose';
import { CreateBlogDto } from '../dto/CreateBlogDto';
import { AuthUserData } from '../../common/types/AuthUserData';

Injectable();
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModel) {}

  async createBlog(
    dto: CreateBlogDto,
    authUserData: AuthUserData,
  ): Promise<BlogDocument> {
    return await this.blogModel.createBlogForUser(
      dto,
      authUserData,
      this.blogModel,
    );
  }

  async removeUserFromBanList(blogId: string, userId: string) {
    const result = await this.blogModel.updateOne(
      { _id: new Types.ObjectId(blogId) },
      {
        $pull: {
          'blogBanInfo.bannedUserForThisBlog': {
            userId: new Types.ObjectId(userId),
          },
        },
      },
    );
    return result.matchedCount === 1;
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

  async isUserBannedForBlog(blogId: string, userId: string): Promise<boolean> {
    const elem = await this.blogModel.findOne({
      _id: blogId,
      'blogBanInfo.bannedUserForThisBlog.userId': new Types.ObjectId(userId),
    });

    return !!elem;
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
