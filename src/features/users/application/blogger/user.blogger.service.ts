import { UsersRepository } from '../../repositories/Users.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserBloggerService {
  constructor(private readonly usersRepository: UsersRepository) {}
}
