import { Injectable } from '@nestjs/common';
import { Connection } from './connections.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectModel(Connection.name)
    private readonly connectionModel: Model<Connection>,
  ) {}
  create(dto: Connection) {
    return this.connectionModel.create(dto);
  }

  sendRequest(senderId: string, receiverId: string) {
    return this.connectionModel.create({
      userId: senderId,
      friendId: receiverId,
    });
  }

  acceptRequest(dto: Connection) {
    return this.connectionModel.create(dto);
  }

  areFriends(ids: string[]) {
    return !!this.connectionModel.countDocuments({
      $and: [
        { userId: ids[0], friendId: ids[1] },
        { userId: ids[1], friendId: ids[0] },
      ],
    });
  }
}
