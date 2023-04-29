import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now, Types } from 'mongoose';
import { Blog } from '../../blogs/schemas/blog.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Blogs' })
  blogId: Blog;

  @Prop({ type: String, required: true })
  blogName: string;

  @Prop({ default: now() })
  blogsName: Date;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;

  // updateData({ name, description, websiteUrl }: UpdateBlogDto) {
  //   if (name && description && websiteUrl) {
  //     this.name = name;
  //     this.description = description;
  //     this.websiteUrl = websiteUrl;
  //   }
  //}
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'targetId',
});

// PostSchema.methods = {
//   updateData: Post.prototype.updateData,
// };
