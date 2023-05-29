export const postQueryMapper = ({
  sortBy,
  sortDirection,
  pageNumber,
  pageSize,
}: PostInputQueryType): PostQueryType => {
  return {
    sortBy: sortBy || 'createdAt',
    sortDirection: sortDirection || 'desc',
    pageNumber: Number(pageNumber) || 1,
    pageSize: Number(pageSize) || 10,
  };
};

export type PostInputQueryType = {
  sortBy: string | undefined;
  sortDirection: string | undefined;
  pageNumber: string | undefined;
  pageSize: string | undefined;
};

export type PostQueryType = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};
