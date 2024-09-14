import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import STRINGS from 'src/common/consts/strings.json';
import { query } from 'express';
import { parseQuery, QueryType } from 'src/common/db/query';
import { Config } from './configs.schema';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class ConfigsService {
  constructor(@InjectModel(Config.name) private configModel: Model<Config>) {}
  async create(createConfigDto: CreateConfigDto) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.configModel.create(createConfigDto),
    };
  }
  async findAll() {
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
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.configModel
        .findByIdAndUpdate(id, updateConfigDto, { returnDocument: 'after' })
        .lean(),
    };
  }

  async remove(id: string) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.configModel.findByIdAndDelete(id).lean(),
    };
  }
}
