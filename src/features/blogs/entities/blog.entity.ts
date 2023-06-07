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
export class BannedUser {
  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ type: Date })
  banDate: Date;

  @Prop({ type: String })
  banReason: string;
}

export const BannedUserSchema = SchemaFactory.createForClass(BannedUser);
@Schema({ _id: false })
export class BlogBanInfo {
  @Prop({ type: Boolean, default: false })
  isBanned: boolean;

  @Prop({
    type: [BannedUserSchema],
    default: [],
  })
  bannedUserForThisBlog: BannedUser[];
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
  blogBanInfo: BlogBanInfo;

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

  addUserToBanList(userId: string, banReason: string) {
    this.blogBanInfo.bannedUserForThisBlog.push({
      userId: new Types.ObjectId(userId),
      banDate: new Date(),
      banReason: banReason,
    });
  }

  isUserInBanList(userId: string): boolean {
    //check user is in ban list of current blog
    const item = this.blogBanInfo.bannedUserForThisBlog.find(
      (item) => item.userId.toString() === userId,
    );
    return !!item;
  }

  isCanBeBoundToUser(): boolean {
    return this.blogOwnerInfo.userId === null;
  }

  bindToUser(userId: string, userLogin: string) {
    this.blogOwnerInfo.userId = new Types.ObjectId(userId);
    this.blogOwnerInfo.userLogin = userLogin;
  }

  setBanStatus(isBanned: boolean) {
    this.blogBanInfo.isBanned = isBanned;
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
  isUserInBanList: Blog.prototype.isUserInBanList,
  addUserToBanList: Blog.prototype.addUserToBanList,
  setBanStatus: Blog.prototype.setBanStatus,
};

BlogEntity.statics = {
  createBlogForUser: Blog.createBlogForUser,
};
