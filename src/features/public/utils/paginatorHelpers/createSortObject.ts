export const createSortObject = (sortBy: string, sortDirection: string) => {
  const sortingObj: any = {};

  sortingObj[sortBy] = sortDirection === 'asc' ? 1 : -1;

  return sortingObj;
};
