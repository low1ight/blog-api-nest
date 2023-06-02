import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsPublicController } from './features/blogs/controllers/blogs.public.controller';
import { BlogsPublicService } from './features/blogs/application/blogs.public.service';
import { BlogsRepository } from './features/blogs/repository/blogs.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogEntity, Blog } from './features/blogs/entities/blog.entity';
import { BlogsQueryRepository } from './features/blogs/repository/blogs.query.repository';
import { PostsController } from './features/posts/posts.controller';
import { PostsQueryRepository } from './features/posts/repository/posts.query.repository';
import { Post, PostSchema } from './features/posts/schemas/post.schema';
import { Like, LikeSchema } from './features/likes/schemas/like.schema';
import { PostsRepository } from './features/posts/repository/posts.repository';
import { PostsPublicService } from './features/posts/application/posts.public.service';
import { UsersSaController } from './features/users/contollers/users.sa.controller';
import { UsersQueryRepository } from './features/users/repositories/users.query.repository';
import { User, UserEntity } from './features/users/entities/user.entity';
import { UsersRepository } from './features/users/repositories/Users.repository';
import { UsersSaService } from './features/users/application/sa/users.sa.service';
import {
  Comment,
  CommentSchema,
} from './features/comments/schemas/comment.schema';
import { CommentsQueryRepository } from './features/comments/repository/comments.query.repository';
import { CommentsController } from './features/comments/comments.controller';
import { TestingController } from './features/testing/testing.controller';
import { TestingService } from './features/testing/testing.service';
import { TestingRepository } from './features/testing/repository/testing.repository';
import {
  IsUserEmailAlreadyExist,
  IsUserFiledAlreadyExistConstraint,
  IsUserLoginAlreadyExist,
} from './features/common/custromValidators/IsUserFieldsExist';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './features/auth/auth.service';
import { LocalStrategy } from './features/auth/strategies/local.strategy';
import { AuthController } from './features/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Device, DeviceSchema } from './features/devices/schemas/device.schema';
import { DevicesRepository } from './features/devices/repository/devices.repository';
import { DevicesService } from './features/devices/devices.service';
import { AccessTokenStrategy } from './features/auth/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './features/auth/strategies/refreshToken.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailManager } from './features/adapters/email.manager';
import { CommentsService } from './features/comments/comments.service';
import { CommentsRepository } from './features/comments/repository/comments.repository';
import { LikesService } from './features/likes/likes.service';
import { LikeRepository } from './features/likes/repository/like.repository';
import { BasicStrategy } from './features/auth/strategies/basic.strategy';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DevicesController } from './features/devices/devices.controller';
import { DevicesQueryRepository } from './features/devices/repository/devices.query.repository';
import { IsBlogExist } from './features/common/custromValidators/isBlogExist';
import { BlogsBloggerService } from './features/blogs/application/blogs.blogger.service';
import { BlogsBloggerController } from './features/blogs/controllers/blogs.blogger.controller';
import { PostsBloggerService } from './features/posts/application/posts.blogger.service';
import { BlogsSaController } from './features/blogs/controllers/blogs.sa.controller';
import { BlogsSaService } from './features/blogs/application/blogs.sa.service';
import { CqrsModule } from '@nestjs/cqrs';
import { BanUserUseCase } from './features/users/application/sa/use-case/ban-user-use-case';

const useCases = [BanUserUseCase];

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
      { name: Blog.name, schema: BlogEntity },
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
      { name: User.name, schema: UserEntity },
      { name: Comment.name, schema: CommentSchema },
      { name: Device.name, schema: DeviceSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    ThrottlerModule.forRoot({}),
    PassportModule,
    CqrsModule,
  ],
  controllers: [
    AppController,
    BlogsPublicController,
    PostsController,
    UsersSaController,
    CommentsController,
    BlogsSaController,
    TestingController,
    AuthController,
    DevicesController,
    BlogsBloggerController,
  ],
  providers: [
    AppService,
    EmailManager,
    IsUserFiledAlreadyExistConstraint,
    IsUserLoginAlreadyExist,
    IsUserEmailAlreadyExist,
    IsBlogExist,
    BlogsPublicService,
    BlogsRepository,
    BlogsSaService,
    BlogsQueryRepository,
    PostsQueryRepository,
    PostsRepository,
    PostsPublicService,
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
    PostsBloggerService,
    BlogsBloggerService,
    ...useCases,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
