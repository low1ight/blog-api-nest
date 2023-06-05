import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { UpdateBlogDto } from '../dto/UpdateBlogDto';
import { CreateBlogDto } from '../dto/CreateBlogDto';
import { AuthUserData } from '../../common/types/AuthUserData';

export type BlogDocument = HydratedDocument<Blog>;

export interface BlogModel extends Model<Blog> {
  createBlogForUser(
    dto: CreateBlogDto,
    authUserData: AuthUserData,
    blogModel: Model<Blog>,
  ): Promise<BlogDocument>;
}

@Schema({ _id: false })
class BlogOwnerInfo {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  userLogin: string;
}

@Schema({ _id: false })
export class BannedUserItem {
  @Prop({ type: Types.ObjectId, default: false })
  useId: Types.ObjectId;

  @Prop({ type: Date, default: false })
  banDate: Date;

  @Prop({ type: String, default: false })
  banReason: string;
}
@Schema({ _id: false })
export class BlogBanInfo {
  @Prop({ type: Boolean, default: false })
  isBanned: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  bannedUserForThisBlog: Types.ObjectId[];
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

  @Prop({ type: BlogOwnerInfo, required: true })
  blogOwnerInfo: BlogOwnerInfo;

  @Prop({ type: BlogBanInfo, default: () => new BlogBanInfo() })
  BlogBanInfo: BlogBanInfo;

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

  isCanBeBoundToUser(): boolean {
    return this.blogOwnerInfo.userId === null;
  }

  bindToUser(userId: string, userLogin: string) {
    this.blogOwnerInfo.userId = new Types.ObjectId(userId);
    this.blogOwnerInfo.userLogin = userLogin;
  }

  static async createBlogForUser(
    dto: CreateBlogDto,
    { id, userName }: AuthUserData,
    blogModel: Model<Blog>,
  ) {
    return new blogModel({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: false,
      blogOwnerInfo: {
        userId: new Types.ObjectId(id),
        userLogin: userName,
      },
    });
  }
}

export const BlogEntity = SchemaFactory.createForClass(Blog);

BlogEntity.methods = {
  updateData: Blog.prototype.updateData,
  isCanBeBoundToUser: Blog.prototype.isCanBeBoundToUser,
  bindToUser: Blog.prototype.bindToUser,
};

BlogEntity.statics = {
  createBlogForUser: Blog.createBlogForUser,
};
