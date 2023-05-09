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

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://qlowlight:uNrmiq0xtAknlUjI@cluster0.xahjpqu.mongodb.net/blog?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [
    AppController,
    BlogsController,
    PostsController,
    UsersController,
    CommentsController,
    TestingController,
  ],
  providers: [
    AppService,
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
    TestingRepository,
  ],
})
export class AppModule {}
