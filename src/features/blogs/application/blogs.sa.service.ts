import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../repository/blogs.repository';
import { UsersRepository } from '../../users/repositories/Users.repository';

@Injectable()
export class BlogsSaService {
  constructor(
    protected readonly blogsRepository: BlogsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async bindUserToBlog(blogId: string, userId: string) {
    const blog = await this.blogsRepository.getBlogById(blogId);
    const user = await this.usersRepository.getUserById(userId);

    if (!blog || !user) return false;

    if (!blog.isCanBeBoundToUser()) return false;

    blog.bindToUser(userId, user.userData.login);

    await this.blogsRepository.save(blog);

    return true;
  }
}
