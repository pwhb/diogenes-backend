import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './rooms.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}
  async create(dto: CreateRoomDto) {
    return this.roomModel.create(dto);
  }

  async findAll({
    filter,
    skip,
    limit,
    sort,
  }: {
    filter: FilterQuery<Room>;
    skip?: number;
    limit?: number;
    sort?: QueryOptions<Room>;
  }) {
    const docs = await this.roomModel
      .find(filter, {}, { skip, limit, sort })
      .lean();
    const count = await this.roomModel.countDocuments(filter);
    return {
      count,
      data: docs,
    };
  }

  findOne(id: string) {
    return this.roomModel.findById(id).lean();
  }

  update(id: string, dto: UpdateRoomDto) {
    return this.roomModel
      .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
      .lean();
  }

  remove(id: string) {
    return this.roomModel.findByIdAndDelete(id).lean();
  }
}
