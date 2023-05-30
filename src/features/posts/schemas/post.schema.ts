import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UpdatePostDto } from '../dto/UpdatePostDto';

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
  blogId: Types.ObjectId;

  @Prop({ type: String, required: true })
  blogName: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  updateData({
    title,
    shortDescription,
    content,
    blogId,
    blogName,
  }: UpdatePostDto) {
    if (title && shortDescription && content && blogId && blogName) {
      this.title = title;
      this.shortDescription = shortDescription;
      this.content = content;
      this.blogId = new Types.ObjectId(blogId);
      this.blogName = blogName;
    }
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'targetId',
  options: { match: { isLikeOwnerBanned: false } },
});

PostSchema.methods = {
  updateData: Post.prototype.updateData,
};
