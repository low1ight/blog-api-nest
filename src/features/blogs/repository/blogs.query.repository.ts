import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../entities/blog.entity';
import { Model, Types } from 'mongoose';
import { BlogQueryType } from '../../utils/query-mappers/blog-query-mapper';
import { createFindByOneFieldObj } from '../../utils/paginatorHelpers/createFindByOneFieldObj';
import { createSortObject } from '../../utils/paginatorHelpers/createSortObject';
import { calcSkipCount } from '../../utils/paginatorHelpers/calcSkipCount';
import { toViwModelWithPaginator } from '../../utils/paginatorHelpers/toViwModelWithPaginator';
import { Injectable } from '@nestjs/common';
import { BlogSaViewModel, BlogViewModel } from '../types/Blog.view.model';

Injectable();
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  async getBlogs(query: BlogQueryType) {
    return await this.findBlogWithQuery(
      query,
      { 'blogBanInfo.isBanned': false },
      this.blogObjToPublicViewModel,
    );
  }
  async getBlogsWitchCurrentUserIsOwner(
    query: BlogQueryType,
    currentUserId: string,
  ) {
    return await this.findBlogWithQuery(
      query,
      {
        'blogOwnerInfo.userId': new Types.ObjectId(currentUserId),
      },
      this.blogObjToPublicViewModel,
    );
  }

  async getAllBlogsForSa(query: BlogQueryType) {
    return await this.findBlogWithQuery(query, {}, this.blogObjToSaViewModel);
  }

  async getBlogById(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;

    const user: BlogDocument | null = await this.blogModel.findOne({
      _id: id,
      'blogBanInfo.isBanned': false,
    });
    if (!user) return null;

    return this.blogObjToPublicViewModel(user);
  }

  async findBlogWithQuery(
    {
      searchNameTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    }: BlogQueryType,
    additionFindParams: object = null,
    toViewModelFunc,
  ) {
    const findParams = createFindByOneFieldObj('name', searchNameTerm);

    const sortObj = createSortObject(sortBy, sortDirection);

    const skipCount = calcSkipCount(pageNumber, pageSize);

    const query = this.blogModel.find({ ...findParams, ...additionFindParams });

    query.skip(skipCount);

    query.limit(pageSize);

    query.sort(sortObj);

    query.setOptions({ lean: true });

    const blogs = await query.exec();

    const totalElemCount = await this.blogModel
      .countDocuments({ ...findParams, ...additionFindParams })
      .exec();

    const blogsViewModel = this.blogsArrToViewModel(blogs, toViewModelFunc);

    return toViwModelWithPaginator(
      blogsViewModel,
      pageNumber,
      pageSize,
      totalElemCount,
    );
  }

  blogsArrToViewModel = (arr: BlogDocument[], toModelFunc): BlogViewModel[] => {
    return arr.map((item) => toModelFunc(item));
  };

  async getAllUserBlogsId(userId: string) {
    const blogs = await this.blogModel.find({
      'blogOwnerInfo.userId': new Types.ObjectId(userId),
    });

    return blogs.map((i) => i._id);
  }

  blogObjToPublicViewModel = (item: BlogDocument): BlogViewModel => {
    return {
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      websiteUrl: item.websiteUrl,
      createdAt: item.createdAt,
      isMembership: item.isMembership,
    };
  };

  blogObjToSaViewModel = (item: BlogDocument): BlogSaViewModel => {
    return {
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      websiteUrl: item.websiteUrl,
      createdAt: item.createdAt,
      isMembership: item.isMembership,
      blogOwnerInfo: {
        userId: item.blogOwnerInfo.userId.toString(),
        userLogin: item.blogOwnerInfo.userLogin,
      },
      banInfo: {
        isBanned: item.blogBanInfo.isBanned,
        banDate: item.blogBanInfo.banDate,
      },
    };
  };
}
