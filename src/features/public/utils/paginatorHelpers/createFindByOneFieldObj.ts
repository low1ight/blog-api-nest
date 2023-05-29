export const createFindByOneFieldObj = (
  findBy: string,
  findSubstring: string | null,
) => {
  if (!findSubstring) return {};

  const findObj: any = {};

  findObj[findBy] = { $regex: findSubstring, $options: 'i' };

  return findObj;
};
