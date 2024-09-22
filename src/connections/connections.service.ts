import { Injectable } from '@nestjs/common';
import { Connection } from './connections.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectModel(Connection.name)
    private readonly connectionModel: Model<Connection>,
  ) {}
  async create({
    userId,
    friendId,
  }: {
    userId: Types.ObjectId;
    friendId: Types.ObjectId;
  }) {
    return this.connectionModel
      .findOneAndUpdate(
        { userId: userId, friendId: friendId },
        {
          userId: userId,
          friendId: friendId,
        },
        { upsert: true, returnDocument: 'after' },
      )
      .lean();
  }

  async isRequestSent({
    userId,
    friendId,
  }: {
    userId: Types.ObjectId;
    friendId: Types.ObjectId;
  }) {
    return (
      (await this.connectionModel.countDocuments({
        userId: userId,
        friendId: friendId,
      })) > 0
    );
  }

  areFriends(ids: string[]) {
    return !!this.connectionModel.countDocuments({
      $and: [
        { userId: ids[0], friendId: ids[1] },
        { userId: ids[1], friendId: ids[0] },
      ],
    });
  }

  getConnections(ids: Types.ObjectId[]) {
    return this.connectionModel.find({
      $or: [
        { userId: ids[0], friendId: ids[1] },
        { userId: ids[1], friendId: ids[0] },
      ],
    });
  }
}
