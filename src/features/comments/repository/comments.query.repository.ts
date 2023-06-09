import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Comment } from '../schemas/comment.schema';
import {
  commentsArrToViewModel,
  commentsObjToViewModel,
} from './mappers/toCommentViewModel';
import { CommentPopulatedDocument } from '../types/comment.types';
import { createSortObject } from '../../utils/paginatorHelpers/createSortObject';
import { CommentQueryType } from '../../utils/query-mappers/comment-query-mapper';
import { calcSkipCount } from '../../utils/paginatorHelpers/calcSkipCount';
import { toViwModelWithPaginator } from '../../utils/paginatorHelpers/toViwModelWithPaginator';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async getCommentById(id: string, currentAuthUserId: string | null) {
    if (!mongoose.isValidObjectId(id)) return null;

    const query = this.commentModel.findOne({ _id: id });

    query.populate('likes');

    const comment: CommentPopulatedDocument = await query.exec();

    if (!comment) return null;

    return commentsObjToViewModel(comment, currentAuthUserId);
  }

  async getCommentsByPostsIdArr(
    query: CommentQueryType,
    postsIdArr: Types.ObjectId[],
    currentAuthUserId: string,
  ) {
    return await this.getCommentsWithPaginator(query, currentAuthUserId, {
      postId: { $in: postsIdArr },
      isCommentOwnerBanned: false,
    });
  }

  async getPostCommentsWithPaginator(
    query: CommentQueryType,
    postId: string,
    currentAuthUserId: string,
  ) {
    return await this.getCommentsWithPaginator(query, currentAuthUserId, {
      postId: new Types.ObjectId(postId),
      isCommentOwnerBanned: false,
    });
  }

  async getCommentsWithPaginator(
    { sortBy, sortDirection, pageNumber, pageSize }: CommentQueryType,
    currentAuthUserId: null | string,
    additionalParams: object = {},
  ) {
    const sortObj = createSortObject(sortBy, sortDirection);

    const skipCount = calcSkipCount(pageNumber, pageSize);

    const query = this.commentModel.find(additionalParams);

    query.skip(skipCount);

    query.limit(pageSize);

    query.sort(sortObj);

    query.populate('likes');

    const totalElemCount = await this.commentModel
      .countDocuments(additionalParams)
      .exec();

    const comments: CommentPopulatedDocument[] = await query.exec();

    const commentsViewModel = commentsArrToViewModel(
      comments,
      currentAuthUserId,
    );

    return toViwModelWithPaginator(
      commentsViewModel,
      pageNumber,
      pageSize,
      totalElemCount,
    );
  }
}
