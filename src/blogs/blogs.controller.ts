import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CustomResponse } from '../utils/customResponse/CustomResponse';

@Controller('users')
export class BlogsController {
  constructor(private readonly userService: BlogsService) {}
  @Get()
  async getUsers() {
    // return await this.userService.getUsers();
    return null;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user: CustomResponse<any> = await this.userService.getUserById(id);

    if (user.errStatusCode)
      throw new NotFoundException(`User with id ${id} not found`);

    return user.content;
  }
}
