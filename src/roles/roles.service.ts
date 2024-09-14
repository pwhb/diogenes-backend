import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './roles.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import STRINGS from 'src/common/consts/strings.json';
import { query } from 'express';
import { parseQuery, QueryType } from 'src/common/db/query';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}
  async create(createRoleDto: CreateRoleDto) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.roleModel.create(createRoleDto),
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

    const docs = await this.roleModel
      .find(filter, {}, { skip, limit, sort })
      .lean();
    const count = await this.roleModel.countDocuments(filter);
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
      data: await this.roleModel.findById(id),
    };
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.roleModel.findByIdAndUpdate(id, updateRoleDto).lean(),
    };
  }

  async remove(id: string) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.roleModel.findByIdAndDelete(id).lean(),
    };
  }
}
