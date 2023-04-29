export const createFindBySeveralFieldObj = (
  findValues: FindObj,
  findType: string,
) => {
  const findValuesArr: any = [];

  for (const key in findValues) {
    const value = findValues[key];

    if (value) {
      const findByValue: any = {};

      findByValue[key] = { $regex: value, $options: 'i' };

      findValuesArr.push(findByValue);
    }
  }

  if (findValuesArr.length === 0) return {};

  const findObj: any = {};

  findObj[findType] = findValuesArr;

  return findObj;
};

type FindObj = {
  [key: string]: string | null;
};
