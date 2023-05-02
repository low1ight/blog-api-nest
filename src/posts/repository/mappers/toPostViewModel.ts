import { LikeDocument } from '../../../likes/schemas/like.schema';
import { PostDocument } from '../../schemas/post.schema';
import { PostPopulatedDocument, PostViewModel } from '../../types/post.types';

export const postsArrToViewModel = (
  arr: PostPopulatedDocument[],
  userPostsLikes: LikeDocument[] | null,
): PostViewModel[] => {
  return arr.map((item) => postsObjToViewModel(item, userPostsLikes));
};

export const postsObjToViewModel = (
  item: PostPopulatedDocument,
  userPostsLikes: LikeDocument[] | null,
): PostViewModel => {
  let likeItem;
  let lastLikeArr: LikeDocument[] = [];
  let likesCount = 0;
  let dislikesCount = 0;
  if (item.likes.length > 0) {
    //if post include any like/dislike calculate like/dislike count
    const like = item.likes.filter((i) => i.likeStatus === 'Like');
    likesCount = like.length;
    dislikesCount = item.likes.length - likesCount;
    lastLikeArr = like
      .sort((a, b) =>
        a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0,
      )
      .slice(0, 3);
  }

  if (userPostsLikes) {
    //find current user like for this item
    likeItem = userPostsLikes.find(
      (i) => i.targetId.toString() === item._id.toString(),
    );
  }

  return {
    id: item._id.toString(),
    title: item.title,
    shortDescription: item.shortDescription,
    content: item.content,
    blogId: item.blogId.toString(),
    blogName: item.blogName,
    createdAt: item.createdAt,
    extendedLikesInfo: {
      likesCount,
      dislikesCount,
      myStatus: likeItem?.likeStatus || 'None',
      newestLikes: mapToNewestLikeViewModel(lastLikeArr),
    },
  };
};

export const createdPostToViewModel = (item: PostDocument): PostViewModel => {
  return {
    id: item._id.toString(),
    title: item.title,
    shortDescription: item.shortDescription,
    content: item.content,
    blogId: item.blogId.toString(),
    blogName: item.blogName,
    createdAt: item.createdAt,
    extendedLikesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    },
  };
};

function mapToNewestLikeViewModel(arr: LikeDocument[]) {
  return arr.map((i) => {
    return {
      addedAt: i.updatedAt,
      userId: i.userId.toString(),
      login: i.userLogin,
    };
  });
}
