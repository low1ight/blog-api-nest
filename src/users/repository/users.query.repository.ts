import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UserQueryType } from '../../utils/query-mappers/user-query-mapper';
import { createSortObject } from '../../utils/paginatorHelpers/createSortObject';
import { calcSkipCount } from '../../utils/paginatorHelpers/calcSkipCount';
import { createFindBySeveralFieldObj } from '../../utils/paginatorHelpers/createFindBySeveralFieldObj';
import { toViwModelWithPaginator } from '../../utils/paginatorHelpers/toViwModelWithPaginator';
import { usersArrToViewModel } from './mappers/toUserViewModel';

Injectable();
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUsers(query: UserQueryType) {
    return this.getUsersWithPaginator(query);
  }

  async getUsersWithPaginator(
    {
      searchLoginTerm,
      searchEmailTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    }: UserQueryType,
    additionalParams: object = {},
  ) {
    const sortObj = createSortObject('userData.' + sortBy, sortDirection);

    const skipCount = calcSkipCount(pageNumber, pageSize);

    const findFields = createFindBySeveralFieldObj(
      { 'userData.login': searchLoginTerm, 'userData.email': searchEmailTerm },
      '$or',
    );

    const query = this.userModel.find(findFields, additionalParams);

    query.skip(skipCount);

    query.limit(pageSize);

    query.sort(sortObj);

    query.setOptions({ lean: true });

    const totalElemCount = await this.userModel
      .countDocuments(findFields, additionalParams)
      .exec();

    const users = await query.exec();

    const usersViewModel = usersArrToViewModel(users);

    return toViwModelWithPaginator(
      usersViewModel,
      pageNumber,
      pageSize,
      totalElemCount,
    );
  }
}
