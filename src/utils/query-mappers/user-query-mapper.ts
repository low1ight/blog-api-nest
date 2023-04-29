export const userQueryMapper = ({
  searchLoginTerm,
  searchEmailTerm,
  sortBy,
  sortDirection,
  pageNumber,
  pageSize,
}: UserInputQueryType): UserQueryType => {
  return {
    searchLoginTerm: searchLoginTerm || null,
    searchEmailTerm: searchEmailTerm || null,
    sortBy: sortBy || 'createdAt',
    sortDirection: sortDirection || 'desc',
    pageNumber: Number(pageNumber) || 1,
    pageSize: Number(pageSize) || 10,
  };
};

export type UserInputQueryType = {
  searchLoginTerm: string | undefined;
  searchEmailTerm: string | undefined;
  sortBy: string | undefined;
  sortDirection: string | undefined;
  pageNumber: string | undefined;
  pageSize: string | undefined;
};

export type UserQueryType = {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};
