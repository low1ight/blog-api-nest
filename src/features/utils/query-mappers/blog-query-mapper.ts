export const blogQueryMapper = ({
  searchNameTerm,
  sortBy,
  sortDirection,
  pageNumber,
  pageSize,
}: BlogInputQueryType): BlogQueryType => {
  return {
    searchNameTerm: searchNameTerm || null,
    sortBy: sortBy || 'createdAt',
    sortDirection: sortDirection || 'desc',
    pageNumber: Number(pageNumber) || 1,
    pageSize: Number(pageSize) || 10,
  };
};

export type BlogInputQueryType = {
  searchNameTerm: string | undefined;
  sortBy: string | undefined;
  sortDirection: string | undefined;
  pageNumber: string | undefined;
  pageSize: string | undefined;
};

export type BlogQueryType = {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};
