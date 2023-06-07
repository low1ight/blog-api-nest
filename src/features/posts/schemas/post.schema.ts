import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { CreateUpdateBlogPostDto } from '../dto/CreateUpdateBlogPostDto';

export type PostDocument = HydratedDocument<Post>;

export interface PostModel extends Model<Post> {
  createPost(
    {
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    }: CreateUpdateBlogPostDto,
    postModel: Model<Post>,
  ): PostDocument;
}

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

  @Prop({ type: Boolean, default: false })
  isBlogOfThisPostBanned: boolean;

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
  }: CreateUpdateBlogPostDto) {
    if (title && shortDescription && content && blogId && blogName) {
      this.title = title;
      this.shortDescription = shortDescription;
      this.content = content;
      this.blogId = new Types.ObjectId(blogId);
      this.blogName = blogName;
    }
  }

  static async createPost(
    {
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    }: CreateUpdateBlogPostDto,
    postModel: Model<Post>,
  ) {
    return new postModel({
      title,
      shortDescription,
      content,
      blogId: new Types.ObjectId(blogId),
      blogName,
    });
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

PostSchema.statics = {
  createPost: Post.createPost,
};
