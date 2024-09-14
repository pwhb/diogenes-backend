import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './roles.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import STRINGS from 'src/common/consts/strings.json';
import { parseQuery, QueryType } from 'src/common/db/query';
import { QueryRoleDto } from './dto/query-role.dto';

@Injectable()
export class RolsService {
  constructor(@InjectModel(Role.name) private rolModel: Model<Role>) {}
  async create(dto: CreateRoleDto) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.rolModel.create(dto),
    };
  }
  async findAll(query: QueryRoleDto) {
    const { skip, limit, page, sort, filter } = parseQuery(query, [
      {
        key: 'q',
        type: QueryType.Regex,
        searchedFields: [''],
      },
    ]);

    const docs = await this.rolModel
      .find(filter, {}, { skip, limit, sort })
      .lean();
    const count = await this.rolModel.countDocuments(filter);
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
      data: await this.rolModel.findById(id),
    };
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.rolModel
        .findByIdAndUpdate(id, updateRoleDto, { returnDocument: 'after' })
        .lean(),
    };
  }

  async remove(id: string) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.rolModel.findByIdAndDelete(id).lean(),
    };
  }
}
