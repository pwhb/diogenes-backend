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
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}
  async create(dto: CreateRoleDto) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.roleModel.create(dto),
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
    const data = await this.roleModel.findById(id).lean();
    return {
      message: data ? STRINGS.RESPONSES.SUCCESS : STRINGS.RESPONSES.NOT_FOUND,
      data: data,
    };
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.roleModel
        .findByIdAndUpdate(id, updateRoleDto, { returnDocument: 'after' })
        .lean(),
    };
  }

  async remove(id: string) {
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      data: await this.roleModel.findByIdAndDelete(id).lean(),
    };
  }
}
