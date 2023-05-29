import { UserDocument } from '../../schemas/user.schema';
import { UserViewModel } from '../../types/User.view.model';

export const usersArrToViewModel = (arr: UserDocument[]): UserViewModel[] => {
  return arr.map((item) => userObjToViewModel(item));
};

export const userObjToViewModel = (item: UserDocument): UserViewModel => {
  return <UserViewModel>{
    id: item._id.toString(),
    login: item.userData.login,
    email: item.userData.email,
    createdAt: item.userData.createdAt,
    banInfo: {
      isBanned: item.banInfo.isBanned,
      banReason: item.banInfo.banReason,
      banDate: item.banInfo.banDate,
    },
  };
};
