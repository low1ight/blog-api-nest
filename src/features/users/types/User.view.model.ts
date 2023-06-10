export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
  banInfo: {
    isBanned: boolean;
    banReason: string;
    banDate: Date;
  };
};
export type BannedUserViewModel = {
  id: string;
  login: string;
  banInfo: {
    isBanned: boolean;
    banReason: string;
    banDate: Date;
  };
};
