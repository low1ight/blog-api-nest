import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UpdateBlogDto } from '../dto/UpdateBlogDto';

export type BlogDocument = HydratedDocument<Blog>;

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
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.methods = {
  updateData: Blog.prototype.updateData,
};
