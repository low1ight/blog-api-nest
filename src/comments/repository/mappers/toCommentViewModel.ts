import {
  CommentPopulatedDocument,
  CommentViewModel,
} from '../../types/comment.types';
import { CommentDocument } from '../../schemas/comment.schema';

export const commentsArrToViewModel = (
  arr: CommentPopulatedDocument[],
  userActivity: null,
): CommentViewModel[] => {
  return arr.map((item) => commentsObjToViewModel(item, userActivity));
};

export const commentsObjToViewModel = (
  item: CommentPopulatedDocument,
  userActivity: null,
): CommentViewModel => {
  let likeItem;
  let likeCount = 0;
  let dislikeCount = 0;
  if (item.likes.length > 0) {
    //if comment include any like/dislike calculate like/dislike count
    likeCount = item.likes.filter((i) => i.likeStatus === 'Like').length;
    dislikeCount = item.likes.length - likeCount;
  }

  // if (userActivity) {
  //   //find current user like for this item
  //   likeItem = userActivity.find(
  //     (i) => i.targetId.toString() === item._id.toString(),
  //   );
  // }

  return {
    id: item._id.toString(),
    content: item.content,
    commentatorInfo: {
      userId: item.commentatorInfo.userId.toString(),
      userLogin: item.commentatorInfo.userLogin,
    },
    createdAt: item.createdAt,
    likesInfo: {
      likesCount: likeCount,
      dislikesCount: dislikeCount,
      myStatus: likeItem?.likeStatus || 'None',
    },
  };
};
export const createdCommentToViewModel = (
  item: CommentDocument,
): CommentViewModel => {
  return {
    id: item._id.toString(),
    content: item.content,
    commentatorInfo: {
      userId: item.commentatorInfo.userId.toString(),
      userLogin: item.commentatorInfo.userLogin,
    },
    createdAt: item.createdAt,
    likesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
    },
  };
};
