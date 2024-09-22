import { Injectable } from '@nestjs/common';
import { Connection } from './connections.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectModel(Connection.name)
    private readonly tokenModel: Model<Connection>,
  ) {}
}
