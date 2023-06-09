import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../entities/user.entity';
import { UserQueryType } from '../../utils/query-mappers/user-query-mapper';
import { createSortObject } from '../../utils/paginatorHelpers/createSortObject';
import { calcSkipCount } from '../../utils/paginatorHelpers/calcSkipCount';
import { createFindBySeveralFieldObj } from '../../utils/paginatorHelpers/createFindBySeveralFieldObj';
import { toViwModelWithPaginator } from '../../utils/paginatorHelpers/toViwModelWithPaginator';
import { usersArrToViewModel } from './mappers/toUserViewModel';
import { BannedUser } from '../../blogs/entities/blog.entity';
import { UserViewModel } from '../types/User.view.model';
import { PaginatorModel } from '../../utils/paginatorHelpers/paginator.types';

Injectable();
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUsers(query: UserQueryType) {
    const findByBanStatusObj = this.createFindByBanStatusObj(query.banStatus);
    return this.getUsersWithPaginator(query, findByBanStatusObj);
  }

  async getUsersByArrOfId(query, bannedUserArr: BannedUser[]) {
    const arrOfId = bannedUserArr.map((i) => i.userId);
    const arrOfBannedUsers: PaginatorModel<UserViewModel[]> =
      await this.getUsersWithPaginator(query, {
        _id: { $in: arrOfId },
      });

    const bannedUserWithCorrectBanInfo: UserViewModel[] =
      arrOfBannedUsers.items.map((user: any) => {
        const userBanInfo = bannedUserArr.find(
          (i) => i.userId.toString() === user.id,
        );
        user.banInfo = {
          isBanned: true,
          banDate: userBanInfo.banDate,
          banReason: userBanInfo.banReason,
        };

        return user;
      });

    arrOfBannedUsers.items = bannedUserWithCorrectBanInfo;

    return arrOfBannedUsers;
  }

  async isUserBanned(userId: string) {
    const user = await this.userModel.findById(userId);
    return !user || user.banInfo.isBanned;
  }

  async getUserByIdForAuthMe(id: string) {
    const user: UserDocument | null = await this.userModel.findById(id);

    if (!user) return null;

    return {
      email: user.userData.email,
      login: user.userData.login,
      userId: id,
    };
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

    const query = this.userModel.find({ ...findFields, ...additionalParams });

    query.skip(skipCount);

    query.limit(pageSize);

    query.sort(sortObj);

    query.setOptions({ lean: true });

    const totalElemCount = await this.userModel
      .countDocuments({ ...findFields, ...additionalParams })
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

  createFindByBanStatusObj(banStatus: string) {
    let searchByBanStatusObj = {};
    if (banStatus === 'banned')
      searchByBanStatusObj = { 'banInfo.isBanned': true };
    if (banStatus === 'notBanned')
      searchByBanStatusObj = { 'banInfo.isBanned': false };

    return searchByBanStatusObj;
  }
}
