import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { UpdateBlogDto } from '../dto/UpdateBlogDto';
import { CreateBlogDto } from '../dto/CreateBlogDto';

export type BlogDocument = HydratedDocument<Blog>;

export interface BlogModel extends Model<Blog> {
  createBlogForUser(
    dto: CreateBlogDto,
    userId: string,
    blogModel: Model<Blog>,
  ): Promise<BlogDocument>;
}

@Schema({ timestamps: true })
export class Blog {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  websiteUrl: string;

  @Prop({ type: Boolean, default: false })
  isMembership: boolean;

  @Prop({ type: Types.ObjectId, required: true })
  ownerId: Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  updateData({ name, description, websiteUrl }: UpdateBlogDto) {
    if (name && description && websiteUrl) {
      this.name = name;
      this.description = description;
      this.websiteUrl = websiteUrl;
    }
  }

  static async createBlogForUser(
    dto: CreateBlogDto,
    userId: string,
    blogModel: Model<Blog>,
  ) {
    return new blogModel({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: true,
      ownerId: new Types.ObjectId(userId),
    });
  }
}

export const BlogEntity = SchemaFactory.createForClass(Blog);

BlogEntity.methods = {
  updateData: Blog.prototype.updateData,
};

BlogEntity.statics = {
  createBlogForUser: Blog.createBlogForUser,
};
