export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

export type BlogSaViewModel = BlogViewModel & {
  blogOwnerInfo: {
    userId: string;
    userLogin: string;
  };
};
