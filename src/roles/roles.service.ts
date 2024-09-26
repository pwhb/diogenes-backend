import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './roles.schema';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}
  async create(dto: CreateRoleDto) {
    return this.roleModel.create(dto);
  }

  async findMany({
    filter,
    skip,
    limit,
    sort,
  }: {
    filter: FilterQuery<Role>;
    skip?: number;
    limit?: number;
    sort?: QueryOptions<Role>;
  }) {
    const docs = await this.roleModel
      .find(filter, {}, { skip, limit, sort })
      .lean();
    const count = await this.roleModel.countDocuments(filter);
    return {
      count,
      data: docs,
    };
  }

  findOne(id: string) {
    return this.roleModel.findById(id).lean();
  }

  update(id: string, dto: UpdateRoleDto) {
    return this.roleModel
      .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
      .lean();
  }

  remove(id: string) {
    return this.roleModel.findByIdAndDelete(id).lean();
  }
}
