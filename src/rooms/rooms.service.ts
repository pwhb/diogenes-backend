import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room, RoomType } from './rooms.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, Types } from 'mongoose';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class RoomsService
{
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    private readonly cacheService: CacheService,) { }
  async create(dto: CreateRoomDto)
  {
    return this.roomModel.create(dto);
  }

  async get(id: string): Promise<Room | null>
  {
    return this.cacheService.get(`rooms:${id}`, () =>
      this.findOne(id),
    );
  }

  async createFriendChat({ participants }: { participants: Types.ObjectId[]; })
  {
    return this.roomModel
      .findOneAndUpdate(
        {
          type: RoomType.DIRECT,
          participants: participants,
        },
        {
          type: RoomType.DIRECT,
          participants: participants,
          status: 'active',
        },
        { upsert: true, returnDocument: 'after' },
      )
      .lean();
  }

  async getRoomList(id: Types.ObjectId)
  {
    const filter = {
      participants: id,
    };
    const data = await this.roomModel
      .find(filter)
      .populate([
        {
          path: 'participants',
          select: 'username',
        },
      ])
      .lean();
    const count = await this.roomModel.countDocuments(filter);
    return { data, count };
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
  })
  {
    const docs = await this.roomModel
      .find(filter, {}, { skip, limit, sort })
      .lean();
    const count = await this.roomModel.countDocuments(filter);
    return {
      count,
      data: docs,
    };
  }

  findOne(id: string)
  {
    return this.roomModel.findById(id).lean();
  }

  update(id: string, dto: UpdateRoomDto)
  {
    return this.roomModel
      .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
      .lean();
  }

  remove(id: string)
  {
    return this.roomModel.findByIdAndDelete(id).lean();
  }
}
