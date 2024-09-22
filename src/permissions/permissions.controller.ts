import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { QueryPermissionDto } from './dto/query-permission.dto';
import STRINGS from 'src/common/consts/strings.json';
import { parseQuery, QueryType } from 'src/common/db/query';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('permissions')
@Controller('api/v1/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async create(
    @Body() dto: CreatePermissionDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    dto['createdBy'] = req['user']['_id'];
    const data = await this.permissionsService.create(dto);
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data,
    });
  }

  @Get()
  async findAll(@Query() query: QueryPermissionDto, @Res() res: Response) {
    const { skip, limit, page, sort, filter } = parseQuery(query, [
      {
        key: 'q',
        type: QueryType.Regex,
        searchedFields: ['method', 'path', 'name'],
      },
    ]);

    const { count, data } = await this.permissionsService.findAll({
      filter,
      skip,
      limit,
      sort,
    });
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      page,
      size: limit,
      count,
      data,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const data = await this.permissionsService.findOne(id);
    if (!data)
      return res.status(404).json({ message: STRINGS.RESPONSES.NOT_FOUND });
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    dto['updatedBy'] = req['user']['_id'];
    const data = await this.permissionsService.update(id, dto);
    if (!data)
      return res.status(404).json({ message: STRINGS.RESPONSES.NOT_FOUND });
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const data = await this.permissionsService.remove(id);
    if (!data)
      return res.status(404).json({ message: STRINGS.RESPONSES.NOT_FOUND });
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data,
    });
  }
}
