import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../entities/blog.entity';
import { Model, Types } from 'mongoose';
import {
  blogObjToViewModel,
  blogsArrToViewModel,
} from './mappers/toBlogViewModel';
import { BlogQueryType } from '../../utils/query-mappers/blog-query-mapper';
import { createFindByOneFieldObj } from '../../utils/paginatorHelpers/createFindByOneFieldObj';
import { createSortObject } from '../../utils/paginatorHelpers/createSortObject';
import { calcSkipCount } from '../../utils/paginatorHelpers/calcSkipCount';
import { toViwModelWithPaginator } from '../../utils/paginatorHelpers/toViwModelWithPaginator';
import { Injectable } from '@nestjs/common';

Injectable();
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  async getBlogs(query: BlogQueryType) {
    return await this.findBlogWithQuery(query);
  }
  async getBlogsWitchCurrentUserIsOwner(
    query: BlogQueryType,
    currentUserId: string,
  ) {
    return await this.findBlogWithQuery(query, {
      ownerId: new Types.ObjectId(currentUserId),
    });
  }

  async getBlogById(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;

    const user: BlogDocument | null = await this.blogModel.findById(id);
    if (!user) return null;

    return blogObjToViewModel(user);
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
      .countDocuments(findParams)
      .exec();

    const blogsViewModel = blogsArrToViewModel(blogs);

    return toViwModelWithPaginator(
      blogsViewModel,
      pageNumber,
      pageSize,
      totalElemCount,
    );
  }
}
