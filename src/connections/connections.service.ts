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

  sendRequest(dto: Connection) {
    return this.connectionModel.create(dto);
  }

  acceptRequest(dto: Connection) {
    return this.connectionModel.create(dto);
  }
}
