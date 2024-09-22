import { Inject, Injectable } from '@nestjs/common';

import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Config } from './configs.schema';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class ConfigsService {
  constructor(
    @InjectModel(Config.name) private configModel: Model<Config>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async get(code: string): Promise<any> {
    const result = await this.cacheManager.get(code);
    if (result) {
      console.log('FROM CACHE', code);
      return result;
    }
    const resultFromDB = await this.configModel.findOne({ code }).lean();
    if (resultFromDB) {
      console.log('FROM DB', code);
      await this.cacheManager.set(code, resultFromDB, 0);
      return resultFromDB;
    }
    return null;
  }

  async create(createConfigDto: CreateConfigDto) {
    const data = await this.configModel.create(createConfigDto);
    return data;
  }

  async findAll({
    filter,
    skip,
    limit,
    sort,
  }: {
    filter: FilterQuery<Config>;
    skip?: number;
    limit?: number;
    sort?: QueryOptions<Config>;
  }) {
    const docs = await this.configModel
      .find(filter, {}, { skip, limit, sort })
      .lean();
    const count = await this.configModel.countDocuments(filter);
    return {
      count,
      data: docs,
    };
  }

  async findOne(id: string) {
    const data = await this.configModel.findById(id).lean();
    return data;
  }

  async update(id: string, updateConfigDto: UpdateConfigDto) {
    const data = await this.configModel
      .findByIdAndUpdate(id, updateConfigDto, { returnDocument: 'after' })
      .lean();
    await this.cacheManager.del(data.code);
    return data;
  }

  async remove(id: string) {
    const data = await this.configModel.findByIdAndDelete(id).lean();
    await this.cacheManager.del(data.code);
    return data;
  }
}
