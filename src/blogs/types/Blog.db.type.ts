import { Blog } from '../schemas/blog.schema';
import { withIdAndTimeStamps } from '../../types/common.db.types';

export type BlogDbType = Blog & withIdAndTimeStamps;
