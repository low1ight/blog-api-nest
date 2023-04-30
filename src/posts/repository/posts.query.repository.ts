import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { PostQueryType } from '../../utils/query-mappers/post-query-mapper';
import { createSortObject } from '../../utils/paginatorHelpers/createSortObject';
import { calcSkipCount } from '../../utils/paginatorHelpers/calcSkipCount';
import { postsArrToViewModel } from './mappers/toPostViewModel';
import { PostPopulatedDocument, PostViewModel } from '../types/post.types';
import { toViwModelWithPaginator } from '../../utils/paginatorHelpers/toViwModelWithPaginator';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async getPosts(query: PostQueryType) {
    return this.getPostWithPaginator(query, null);
  }

  async getPostsForBlog(query: PostQueryType, blogId: string) {
    return this.getPostWithPaginator(query, null, {
      blogId: new Types.ObjectId(blogId),
    });
  }

  async getPostWithPaginator(
    { sortBy, sortDirection, pageNumber, pageSize }: PostQueryType,
    userPostsLikes: null,
    additionalParams: object = {},
  ) {
    //userPostsLikes is temporary null

    const sortObj = createSortObject(sortBy, sortDirection);

    const skipCount = calcSkipCount(pageNumber, pageSize);

    const query = this.postModel.find(additionalParams);

    query.skip(skipCount);

    query.limit(pageSize);

    query.sort(sortObj);

    query.populate('likes');

    //query.setOptions({ lean: true });

    const totalElemCount = await this.postModel
      .countDocuments(additionalParams)
      .exec();

    const posts: PostPopulatedDocument[] = await query.exec();

    const postViewModel: PostViewModel[] = postsArrToViewModel(posts, null);

    return toViwModelWithPaginator(
      postViewModel,
      pageNumber,
      pageSize,
      totalElemCount,
    );
  }
}
