import { BlogDbType } from '../../types/Blog.db.type';
import { BlogViewModel } from '../../types/Blog.view.model';

export const blogsArrToViewModel = (arr: BlogDbType[]): BlogViewModel[] => {
  return arr.map((item) => blogObjToViewModel(item));
};

export const blogObjToViewModel = (item: BlogDbType): BlogViewModel => {
  return {
    id: item._id.toString(),
    name: item.name,
    description: item.description,
    websiteUrl: item.websiteUrl,
    createdAt: item.createdAt,
    isMembership: item.isMembership,
  };
};
