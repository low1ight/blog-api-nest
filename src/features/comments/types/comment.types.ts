import { ObjectId } from 'mongoose';
import { LikeDocument } from '../../likes/schemas/like.schema';
import { CommentDocument } from '../schemas/comment.schema';
import { PostDocument } from '../../posts/schemas/post.schema';

interface CommentWithLikesAndPost extends CommentDocument {
  likes?: LikeDocument[];
  post?: PostDocument[];
}

export type CommentPopulatedDocument = CommentDocument &
  CommentWithLikesAndPost;

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

export type CommentViewBloggerModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorViewModel;
  createdAt: Date;
  likesInfo: LikesInfo;
  postInfo: { blogId: string; blogName: string; title: string; id: string };
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
