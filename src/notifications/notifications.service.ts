import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './notifications.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, QueryOptions } from 'mongoose';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}
  async create(dto: CreateNotificationDto) {
    return this.notificationModel.create(dto);
  }

  async findMany({
    filter,
    skip,
    limit,
    sort,
  }: {
    filter: FilterQuery<Notification>;
    skip?: number;
    limit?: number;
    sort?: QueryOptions<Notification>;
  }) {
    const docs = await this.notificationModel
      .find(filter, {}, { skip, limit, sort })
      .lean();
    const count = await this.notificationModel.countDocuments(filter);
    return {
      count,
      data: docs,
    };
  }

  findOne(id: string) {
    return this.notificationModel.findById(id).lean();
  }

  update(id: string, dto: UpdateNotificationDto) {
    return this.notificationModel
      .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
      .lean();
  }

  remove(id: string) {
    return this.notificationModel.findByIdAndDelete(id).lean();
  }
}
