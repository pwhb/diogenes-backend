import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.schema';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CacheService } from 'src/cache/cache.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly cacheService: CacheService,
  ) {}

  create(dto: User) {
    return this.userModel.create(dto);
  }

  findUser(filter: FilterQuery<User>) {
    return this.userModel
      .findOne(filter)
      .populate('role', {
        _id: 0,
        name: 1,
      })
      .lean();
  }

  findUserById(userId: string) {
    return this.cacheService.get(`user:${userId}`, () =>
      this.userModel.findById(userId).populate('role').lean(),
    );
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
