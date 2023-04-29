export const commentQueryMapper = ({
  sortBy,
  sortDirection,
  pageNumber,
  pageSize,
}: CommentInputQueryType): CommentQueryType => {
  return {
    sortBy: sortBy || 'createdAt',
    sortDirection: sortDirection || 'desc',
    pageNumber: Number(pageNumber) || 1,
    pageSize: Number(pageSize) || 10,
  };
};

export type CommentInputQueryType = {
  sortBy: string | undefined;
  sortDirection: string | undefined;
  pageNumber: string | undefined;
  pageSize: string | undefined;
};

export type CommentQueryType = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};
