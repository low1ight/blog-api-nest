import { PostDocument } from '../schemas/post.schema';
import { LikeDocument } from '../../likes/shemas/like.schema';

interface PostWithLikes extends PostDocument {
  likes?: LikeDocument[];
}

export type PostPopulatedDocument = PostDocument & PostWithLikes;

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: newestLikeType[];
  };
};

type newestLikeType = {
  addedAt: Date | string;
  userId: string;
  login: string;
};
