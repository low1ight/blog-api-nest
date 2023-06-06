import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';

import { Exceptions } from '../../utils/throwException';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { BanUserForBlog } from '../dto/BanUserForBlog';
import { BanUserForBlogUseCaseCommand } from '../application/blogger/use-cases/ban-user-for-blog-use-case';
import { CurrentUser } from '../../common/decorators/current.user.decorator';
import { CustomResponse } from '../../utils/customResponse/CustomResponse';

@Controller('blogger/users')
export class UsersBloggerController {
  constructor(private commandBus: CommandBus) {}

  // @Get()
  // @UseGuards(BasicAuthGuard)
  // async getUsers(@Query() query: UserInputQueryType) {
  //   const userQuery = userQueryMapper(query);
  //
  //   return await this.userQueryRepository.getUsers(userQuery);
  // }

  @Put(':id/ban')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async banUserForBlog(
    @Param('id') id: string,
    @Body() dto: BanUserForBlog,
    @CurrentUser() user,
  ) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new BanUserForBlogUseCaseCommand(dto, user.id, id),
    );
    if (!result.isSuccess) Exceptions.throwHttpException(result.errStatusCode);
  }
}
