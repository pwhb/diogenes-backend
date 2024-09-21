import { Inject, Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import STRINGS from 'src/common/consts/strings.json';
import { parseQuery, QueryType } from 'src/common/db/query';
import { Config } from './configs.schema';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { QueryConfigDto } from './dto/query-config.dto';

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
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.configModel.create(createConfigDto),
    };
  }
  async findAll(query: QueryConfigDto) {
    const { skip, limit, page, sort, filter } = parseQuery(query, [
      {
        key: 'q',
        type: QueryType.Regex,
        searchedFields: ['firstName', 'lastName'],
      },
    ]);

    const docs = await this.configModel
      .find(filter, {}, { skip, limit, sort })
      .lean();
    const count = await this.configModel.countDocuments(filter);
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      page,
      size: limit,
      count,
      data: docs,
    };
  }

  async findOne(id: string) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.configModel.findById(id),
    };
  }

  async update(id: string, updateConfigDto: UpdateConfigDto) {
    const data = await this.configModel
      .findByIdAndUpdate(id, updateConfigDto, { returnDocument: 'after' })
      .lean();
    await this.cacheManager.del(data.code);
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: data,
    };
  }

  async remove(id: string) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.configModel.findByIdAndDelete(id).lean(),
    };
  }
}
