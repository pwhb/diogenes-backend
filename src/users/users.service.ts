import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.schema';
import { FilterQuery, Model, QueryOptions, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  create(dto: User) {
    return this.userModel.create(dto);
  }

  findUser(filter: FilterQuery<User>) {
    return this.userModel.findOne(filter).populate('role', 'name').lean();
  }

  findUserById(userId: string) {
    return this.userModel.findById(userId).populate('role').lean();
  }

  async findAll({
    filter,
    skip,
    limit,
    sort,
  }: {
    filter: FilterQuery<User>;
    skip?: number;
    limit?: number;
    sort?: QueryOptions<User>;
  }) {
    const docs = await this.userModel
      .find(filter, {}, { skip, limit, sort })
      .lean();
    const count = await this.userModel.countDocuments(filter);
    return {
      count,
      data: docs,
    };
  }

  findOne(id: string) {
    return this.userModel.findById(id).lean();
  }

  update(id: string, dto: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
      .lean();
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id).lean();
  }
}
