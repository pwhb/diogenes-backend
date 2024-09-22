import { Injectable } from '@nestjs/common';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Template } from './templates.schema';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name) private templateModel: Model<Template>,
  ) {}
  async create(dto: CreateTemplateDto) {
    return this.templateModel.create(dto);
  }

  async findAll({
    filter,
    skip,
    limit,
    sort,
  }: {
    filter: FilterQuery<Template>;
    skip?: number;
    limit?: number;
    sort?: QueryOptions<Template>;
  }) {
    const docs = await this.templateModel
      .find(filter, {}, { skip, limit, sort })
      .lean();
    const count = await this.templateModel.countDocuments(filter);
    return {
      count,
      data: docs,
    };
  }

  findOne(id: string) {
    return this.templateModel.findById(id).lean();
  }

  update(id: string, dto: UpdateTemplateDto) {
    return this.templateModel
      .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
      .lean();
  }

  remove(id: string) {
    return this.templateModel.findByIdAndDelete(id).lean();
  }
}
