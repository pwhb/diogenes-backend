import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import STRINGS from 'src/common/consts/strings.json';
import { parseQuery, QueryType } from 'src/common/db/query';
import { Template } from './templates.schema';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { QueryTemplateDto } from './dto/query-role.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name) private templateModel: Model<Template>,
  ) {}
  async create(dto: CreateTemplateDto) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.templateModel.create(dto),
    };
  }
  async findAll(query: QueryTemplateDto) {
    const { skip, limit, page, sort, filter } = parseQuery(query, [
      {
        key: 'q',
        type: QueryType.Regex,
        searchedFields: [''],
      },
    ]);

    const docs = await this.templateModel
      .find(filter, {}, { skip, limit, sort })
      .lean();
    const count = await this.templateModel.countDocuments(filter);
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      page,
      size: limit,
      count,
      data: docs,
    };
  }

  async findOne(id: string) {
    const data = await this.templateModel.findById(id).lean();
    return {
      message: data ? STRINGS.RESPONSES.SUCCESS : STRINGS.RESPONSES.NOT_FOUND,
      data: data,
    };
  }

  async update(id: string, updateRoleDto: UpdateTemplateDto) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.templateModel
        .findByIdAndUpdate(id, updateRoleDto, { returnDocument: 'after' })
        .lean(),
    };
  }

  async remove(id: string) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.templateModel.findByIdAndDelete(id).lean(),
    };
  }
}
