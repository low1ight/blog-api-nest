import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './features/public/blogs/blogs.controller';
import { BlogsService } from './features/public/blogs/blogs.service';
import { BlogsRepository } from './features/public/blogs/repository/blogs.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema, Blog } from './features/public/blogs/schemas/blog.schema';
import { BlogsQueryRepository } from './features/public/blogs/repository/blogs.query.repository';
import { PostsController } from './features/public/posts/posts.controller';
import { PostsQueryRepository } from './features/public/posts/repository/posts.query.repository';
import { Post, PostSchema } from './features/public/posts/schemas/post.schema';
import { Like, LikeSchema } from './features/public/likes/schemas/like.schema';
import { PostsRepository } from './features/public/posts/repository/posts.repository';
import { PostsService } from './features/public/posts/posts.service';
import { UsersSaController } from './features/sa/users/users.sa.controller';
import { UsersQueryRepository } from './features/sa/users/repository/users.query.repository';
import { User, UserSchema } from './features/sa/users/schemas/user.schema';
import { UsersRepository } from './features/sa/users/repository/Users.repository';
import { UsersSaService } from './features/sa/users/application/users.sa.service';
import {
  Comment,
  CommentSchema,
} from './features/public/comments/schemas/comment.schema';
import { CommentsQueryRepository } from './features/public/comments/repository/comments.query.repository';
import { CommentsController } from './features/public/comments/comments.controller';
import { TestingController } from './features/public/testing/testing.controller';
import { TestingService } from './features/public/testing/testing.service';
import { TestingRepository } from './features/public/testing/repository/testing.repository';
import {
  IsUserEmailAlreadyExist,
  IsUserFiledAlreadyExistConstraint,
  IsUserLoginAlreadyExist,
} from './features/public/common/custromValidators/IsUserFieldsExist';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './features/public/auth/auth.service';
import { LocalStrategy } from './features/public/auth/strategies/local.strategy';
import { AuthController } from './features/public/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import {
  Device,
  DeviceSchema,
} from './features/public/devices/schemas/device.schema';
import { DevicesRepository } from './features/public/devices/repository/devices.repository';
import { DevicesService } from './features/public/devices/devices.service';
import { AccessTokenStrategy } from './features/public/auth/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './features/public/auth/strategies/refreshToken.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailManager } from './features/public/adapters/email.manager';
import { CommentsService } from './features/public/comments/comments.service';
import { CommentsRepository } from './features/public/comments/repository/comments.repository';
import { LikesService } from './features/public/likes/likes.service';
import { LikeRepository } from './features/public/likes/repository/like.repository';
import { BasicStrategy } from './features/public/auth/strategies/basic.strategy';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DevicesController } from './features/public/devices/devices.controller';
import { DevicesQueryRepository } from './features/public/devices/repository/devices.query.repository';
import { IsBlogExist } from './features/public/common/custromValidators/isBlogExist';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: process.env.MAILDEV_INCOMING_USER,
          pass: process.env.MAILDEV_INCOMING_PASS,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
    }),
    MongooseModule.forRoot(
      'mongodb+srv://qlowlight:uNrmiq0xtAknlUjI@cluster0.xahjpqu.mongodb.net/blog?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Device.name, schema: DeviceSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    ThrottlerModule.forRoot({}),
    PassportModule,
  ],
  controllers: [
    AppController,
    BlogsController,
    PostsController,
    UsersSaController,
    CommentsController,
    TestingController,
    AuthController,
    DevicesController,
  ],
  providers: [
    AppService,
    EmailManager,
    IsUserFiledAlreadyExistConstraint,
    IsUserLoginAlreadyExist,
    IsUserEmailAlreadyExist,
    IsBlogExist,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsQueryRepository,
    PostsRepository,
    PostsService,
    UsersQueryRepository,
    UsersRepository,
    UsersSaService,
    CommentsQueryRepository,
    TestingService,
    BasicStrategy,
    TestingRepository,
    AuthService,
    LocalStrategy,
    DevicesRepository,
    DevicesService,
    AccessTokenStrategy,
    DevicesQueryRepository,
    CommentsService,
    CommentsRepository,
    RefreshTokenStrategy,
    LikesService,
    LikeRepository,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
