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
