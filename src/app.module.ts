import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsPublicController } from './features/blogs/controllers/blogs.public.controller';
import { BlogsPublicService } from './features/blogs/application/blogs.public.service';
import { BlogsRepository } from './features/blogs/repository/blogs.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogEntity, Blog } from './features/blogs/entities/blog.entity';
import { BlogsQueryRepository } from './features/blogs/repository/blogs.query.repository';
import { PostsPublicController } from './features/posts/controllers/posts.public.controller';
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
import { CommentsController } from './features/comments/controllers/comments.controller';
import { TestingController } from './features/testing/testing.controller';
import { TestingService } from './features/testing/testing.service';
import { TestingRepository } from './features/testing/repository/testing.repository';
import {
  IsUserEmailAlreadyExist,
  IsUserFiledAlreadyExistConstraint,
  IsUserLoginAlreadyExist,
} from './features/common/custromValidators/IsUserFieldsExist';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './features/auth/application/public/auth.service';
import { LocalStrategy } from './features/auth/strategies/local.strategy';
import { AuthController } from './features/auth/controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Device, DeviceSchema } from './features/devices/schemas/device.schema';
import { DevicesRepository } from './features/devices/repository/devices.repository';
import { DevicesService } from './features/devices/devices.service';
import { AccessTokenStrategy } from './features/auth/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './features/auth/strategies/refreshToken.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailManager } from './features/adapters/email.manager';
import { CommentsService } from './features/comments/application/public/comments.service';
import { CommentsRepository } from './features/comments/repository/comments.repository';
import { LikesService } from './features/likes/likes.service';
import { LikeRepository } from './features/likes/repository/like.repository';
import { BasicStrategy } from './features/auth/strategies/basic.strategy';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DevicesController } from './features/devices/devices.controller';
import { DevicesQueryRepository } from './features/devices/repository/devices.query.repository';
import { IsBlogExist } from './features/common/custromValidators/isBlogExist';
import { BlogsBloggerService } from './features/blogs/application/blogger/blogs.blogger.service';
import { BlogsBloggerController } from './features/blogs/controllers/blogs.blogger.controller';
import { PostsBloggerService } from './features/posts/application/blogger/posts.blogger.service';
import { BlogsSaController } from './features/blogs/controllers/blogs.sa.controller';
import { BlogsSaService } from './features/blogs/application/sa/blogs.sa.service';
import { CqrsModule } from '@nestjs/cqrs';
import { BanUserUseCase } from './features/users/application/sa/use-cases/ban-user-use-case';
import { CreateUserUseCase } from './features/users/application/sa/use-cases/create-user-use-case';
import { DeleteUserUseCase } from './features/users/application/sa/use-cases/delete-user-use-case';
import { LoginUseCase } from './features/auth/application/public/use-cases/login-use-case';
import { RegistrationEmailResendingUseCase } from './features/auth/application/public/use-cases/registration-email-resending-use-case';
import { RegistrationUseCase } from './features/auth/application/public/use-cases/registration-use-case';
import { LogoutUseCase } from './features/auth/application/public/use-cases/logout-use-case';
import { PasswordRecoveryUseCase } from './features/auth/application/public/use-cases/password-recovery-use-case';
import { SetNewPasswordUseCase } from './features/auth/application/public/use-cases/set-new-password-use-case';
import { ConfirmEmailUseCase } from './features/auth/application/public/use-cases/confirm-email-use-case';
import { UpdateJwtTokensUseCase } from './features/auth/application/public/use-cases/update-jwt-tokens-use-case';
import { BindUserToBlogUseCase } from './features/blogs/application/sa/use-cases/bind-user-to-blog-use-case';
import { CreateBlogUseCase } from './features/blogs/application/blogger/use-cases/create-blog-use-case';
import { UpdateBlogUseCase } from './features/blogs/application/blogger/use-cases/update-blog-use-case';
import { DeleteBlogUseCase } from './features/blogs/application/blogger/use-cases/delete-blog-use-case';
import { CreatePostUseCase } from './features/posts/application/blogger/use-cases/create-post-use-case';
import { UpdatePostUseCase } from './features/posts/application/blogger/use-cases/update-post-use-case';
import { DeletePostUseCase } from './features/posts/application/blogger/use-cases/delete-post-use-case';
import { DeleteCommentUseCase } from './features/comments/application/public/use-cases/delete-comment-use-case';
import { CreateCommentUseCase } from './features/comments/application/public/use-cases/create-comment-use-case';
import { UpdateCommentUseCase } from './features/comments/application/public/use-cases/update-comment-use-case';
import { UserBloggerService } from './features/users/application/blogger/user.blogger.service';
import { BanUserForBlogUseCase } from './features/users/application/blogger/use-cases/ban-user-for-blog-use-case';
import { UsersBloggerController } from './features/users/contollers/users.blogger.controller';
import { BanBlogUseCase } from './features/blogs/application/sa/use-cases/ban-blog-use-case';

const useCases = [
  BanUserUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  LoginUseCase,
  RegistrationEmailResendingUseCase,
  RegistrationUseCase,
  LogoutUseCase,
  PasswordRecoveryUseCase,
  SetNewPasswordUseCase,
  ConfirmEmailUseCase,
  UpdateJwtTokensUseCase,
  BindUserToBlogUseCase,
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  DeleteCommentUseCase,
  CreateCommentUseCase,
  UpdateCommentUseCase,
  BanUserForBlogUseCase,
  BanBlogUseCase,
];

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
    PostsPublicController,
    UsersSaController,
    CommentsController,
    BlogsSaController,
    TestingController,
    AuthController,
    DevicesController,
    BlogsBloggerController,
    UsersBloggerController,
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
    UserBloggerService,
    ...useCases,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
