import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import STRINGS from 'src/common/consts/strings.json';
import { parseQuery, QueryType } from 'src/common/db/query';
import { QueryUserDto } from './dto/query-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  findUser(filter: FilterQuery<User>) {
    return this.userModel.findOne(filter).lean();
  }

  async findAll(query: QueryUserDto) {
    const { skip, limit, page, sort, filter } = parseQuery(query, [
      {
        key: 'q',
        type: QueryType.Regex,
        searchedFields: ['firstName', 'lastName'],
      },
    ]);

    const docs = await this.userModel
      .find(filter, {}, { skip, limit, sort })
      .lean();
    const count = await this.userModel.countDocuments(filter);
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      page,
      size: limit,
      count,
      data: docs,
    };
  }

  async findOne(id: string) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.userModel.findById(id),
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { returnDocument: 'after' })
        .lean(),
    };
  }

  async remove(id: string) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.userModel.findByIdAndDelete(id).lean(),
    };
  }
}
