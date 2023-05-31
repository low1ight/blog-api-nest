import { BlogViewModel } from '../../types/Blog.view.model';
import { BlogDocument } from '../../entities/blog.entity';

export const blogsArrToViewModel = (arr: BlogDocument[]): BlogViewModel[] => {
  return arr.map((item) => blogObjToViewModel(item));
};

export const blogObjToViewModel = (item: BlogDocument): BlogViewModel => {
  return {
    id: item._id.toString(),
    name: item.name,
    description: item.description,
    websiteUrl: item.websiteUrl,
    createdAt: item.createdAt,
    isMembership: item.isMembership,
  };
};
