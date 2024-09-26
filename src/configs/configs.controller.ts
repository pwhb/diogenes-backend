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
} from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { ApiTags } from '@nestjs/swagger';
import { QueryConfigDto } from './dto/query-config.dto';
import STRINGS from 'src/common/consts/strings.json';
import { Response } from 'express';
import { parseQuery, QueryType } from 'src/common/db/query';
@ApiTags('configs')
@Controller('api/v1/configs')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) {}
  @Post()
  async create(@Body() dto: CreateConfigDto, @Res() res: Response) {
    const data = await this.configsService.create(dto);
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data,
    });
  }

  @Get()
  async findMany(@Query() query: QueryConfigDto, @Res() res: Response) {
    const { skip, limit, page, sort, filter } = parseQuery(query, [
      {
        key: 'q',
        type: QueryType.Regex,
        searchedFields: ['name'],
      },
    ]);

    const { count, data } = await this.configsService.findMany({
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
    const data = await this.configsService.findOne(id);
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
    @Body() dto: UpdateConfigDto,
    @Res() res: Response,
  ) {
    const data = await this.configsService.update(id, dto);
    if (!data)
      return res.status(404).json({ message: STRINGS.RESPONSES.NOT_FOUND });
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const data = await this.configsService.remove(id);
    if (!data)
      return res.status(404).json({ message: STRINGS.RESPONSES.NOT_FOUND });
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data,
    });
  }

  @Post('resetCache')
  async resetCache(@Res() res: Response) {
    await this.configsService.resetCache();
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
    });
  }
}
