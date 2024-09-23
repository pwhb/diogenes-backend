import { Injectable } from '@nestjs/common';
import { Connection } from './connections.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

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

  update(id: string | Types.ObjectId, dto: { status: string }) {
    return this.connectionModel
      .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
      .lean();
  }

  async getFriendList(id: Types.ObjectId) {
    const filter = {
      $or: [{ user1: id }, { user2: id }],
      status: 'friends',
    };
    const data = await this.connectionModel
      .find(filter)
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
    return { data, count };
  }
}
