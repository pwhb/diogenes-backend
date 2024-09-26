import { Injectable } from '@nestjs/common';
import { Connection } from './connections.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, Types } from 'mongoose';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectModel(Connection.name)
    private readonly connectionModel: Model<Connection>,
  ) {}
  create({ user1, user2 }: Connection) {
    return this.connectionModel
      .findOneAndUpdate(
        {
          user1,
          user2,
        },
        {
          user1,
          user2,
        },
        { upsert: true, returnDocument: 'after' },
      )
      .lean();
  }

  findOne(filter: FilterQuery<Connection>) {
    return this.connectionModel.findOne(filter).lean();
  }

  async findMany({
    filter,
    skip,
    limit,
    sort,
  }: {
    filter: FilterQuery<Connection>;
    skip?: number;
    limit?: number;
    sort?: QueryOptions<Connection>;
  }) {
    const docs = await this.connectionModel
      .find(filter, {}, { skip, limit, sort })
      .populate([
        {
          path: 'user1',
          select: 'username',
        },
        {
          path: 'user2',
          select: 'username',
        },
      ])
      .lean();
    const count = await this.connectionModel.countDocuments(filter);
    return {
      count,
      data: docs,
    };
  }

  getFriendList(reqUserId: Types.ObjectId, list: Connection[]) {
    return list.map((v) =>
      v.user1._id.toString() === reqUserId.toString() ? v.user2 : v.user1,
    );
  }

  update(id: string | Types.ObjectId, dto: { status: string }) {
    return this.connectionModel
      .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
      .lean();
  }
}
