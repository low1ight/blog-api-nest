import { ObjectId } from 'mongoose';
import { LikeDocument } from '../../likes/schemas/like.schema';
import { CommentDocument } from '../schemas/comment.schema';

interface CommentWithLikes extends CommentDocument {
  likes?: LikeDocument[];
}

export type CommentPopulatedDocument = CommentDocument & CommentWithLikes;

export type CommentatorInfo = {
  userId: ObjectId;
  userLogin: string;
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorViewModel;
  createdAt: Date;
  likesInfo: LikesInfo;
};

type LikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
};

export type CommentatorViewModel = {
  userId: string;
  userLogin: string;
};
