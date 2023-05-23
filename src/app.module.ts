import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/repository/blogs.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema, Blog } from './blogs/schemas/blog.schema';
import { BlogsQueryRepository } from './blogs/repository/blogs.query.repository';
import { PostsController } from './posts/posts.controller';
import { PostsQueryRepository } from './posts/repository/posts.query.repository';
import { Post, PostSchema } from './posts/schemas/post.schema';
import { Like, LikeSchema } from './likes/schemas/like.schema';
import { PostsRepository } from './posts/repository/posts.repository';
import { PostsService } from './posts/posts.service';
import { UsersController } from './users/users.controller';
import { UsersQueryRepository } from './users/repository/users.query.repository';
import { User, UserSchema } from './users/schemas/user.schema';
import { UsersRepository } from './users/repository/Users.repository';
import { UsersService } from './users/users.service';
import { Comment, CommentSchema } from './comments/schemas/comment.schema';
import { CommentsQueryRepository } from './comments/repository/comments.query.repository';
import { CommentsController } from './comments/comments.controller';
import { TestingController } from './testing/testing.controller';
import { TestingService } from './testing/testing.service';
import { TestingRepository } from './testing/repository/testing.repository';
import {
  IsUserEmailAlreadyExist,
  IsUserFiledAlreadyExistConstraint,
  IsUserLoginAlreadyExist,
} from './custromValidators/IsUserFieldsExist';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { AuthController } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Device, DeviceSchema } from './devices/schemas/device.schema';
import { DevicesRepository } from './devices/repository/devices.repository';
import { DevicesService } from './devices/devices.service';
import { AccessTokenStrategy } from './auth/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './auth/strategies/refreshToken.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailManager } from './adapters/email.manager';
import { CommentsService } from './comments/comments.service';
import { CommentsRepository } from './comments/repository/comments.repository';
import { LikesService } from './likes/likes.service';
import { LikeRepository } from './likes/repository/like.repository';
import { BasicStrategy } from './auth/strategies/basic.strategy';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

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
    UsersController,
    CommentsController,
    TestingController,
    AuthController,
  ],
  providers: [
    AppService,
    EmailManager,
    IsUserFiledAlreadyExistConstraint,
    IsUserLoginAlreadyExist,
    IsUserEmailAlreadyExist,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsQueryRepository,
    PostsRepository,
    PostsService,
    UsersQueryRepository,
    UsersRepository,
    UsersService,
    CommentsQueryRepository,
    TestingService,
    BasicStrategy,
    TestingRepository,
    AuthService,
    LocalStrategy,
    DevicesRepository,
    DevicesService,
    AccessTokenStrategy,
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
