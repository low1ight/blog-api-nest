import {
  CommentPopulatedDocument,
  CommentViewBloggerModel,
  CommentViewModel,
} from '../../types/comment.types';

export const commentsArrToViewModel = (
  arr: CommentPopulatedDocument[],
  currentAuthUserId: null | string,
): CommentViewModel[] => {
  return arr.map((item) => commentsObjToViewModel(item, currentAuthUserId));
};

export const commentsArrToViewBloggerModel = (
  arr: CommentPopulatedDocument[],
  currentAuthUserId: null | string,
): CommentViewBloggerModel[] => {
  return arr.map((item) =>
    commentsObjToViewModelForBlogger(item, currentAuthUserId),
  );
};

export const commentsObjToViewModel = (
  item: CommentPopulatedDocument,
  currentAuthUserId: null | string,
) => {
  let likeItem;
  let likeCount = 0;
  let dislikeCount = 0;
  if (item.likes.length > 0) {
    //if comment include any like/dislike calculate like/dislike count
    likeCount = item.likes.filter((i) => i.likeStatus === 'Like').length;
    dislikeCount = item.likes.length - likeCount;
  }

  if (currentAuthUserId) {
    //find current user like for this item
    likeItem = item.likes.find(
      (i) => i.userId.toString() === currentAuthUserId,
    );
  }

  return createCommentWithLikeViewModel(
    item,
    likeCount,
    dislikeCount,
    likeItem,
  );
};

const createCommentWithLikeViewModel = (
  comment,
  likeCount,
  dislikeCount,
  likeItem,
) => {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId.toString(),
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: likeCount,
      dislikesCount: dislikeCount,
      myStatus: likeItem?.likeStatus || 'None',
    },
  };
};

const commentsObjToViewModelForBlogger = (
  item: CommentPopulatedDocument,
  currentAuthUserId: null | string,
): CommentViewBloggerModel => {
  const commentWithLike = commentsObjToViewModel(item, currentAuthUserId);

  const post = item.post[0];

  return {
    ...commentWithLike,
    postInfo: {
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      title: post.title,
      id: post._id.toString(),
    },
  };
};
