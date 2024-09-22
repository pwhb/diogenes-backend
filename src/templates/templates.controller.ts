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
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { QueryTemplateDto } from './dto/query-role.dto';
import { Request, Response } from 'express';
import STRINGS from 'src/common/consts/strings.json';
import { parseQuery, QueryType } from 'src/common/db/query';

@Controller('api/v1/templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}
  @Post()
  async create(
    @Body() dto: CreateTemplateDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    dto['createdBy'] = req['user']['_id'];
    const data = await this.templatesService.create(dto);
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data,
    });
  }

  @Get()
  async findAll(@Query() query: QueryTemplateDto, @Res() res: Response) {
    const { skip, limit, page, sort, filter } = parseQuery(query, [
      {
        key: 'q',
        type: QueryType.Regex,
        searchedFields: ['name'],
      },
    ]);

    const { count, data } = await this.templatesService.findAll({
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
    const data = await this.templatesService.findOne(id);
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
    @Req() req: Request,
    @Body() dto: UpdateTemplateDto,
    @Res() res: Response,
  ) {
    dto['updatedBy'] = req['user']['_id'];
    const data = await this.templatesService.update(id, dto);
    if (!data)
      return res.status(404).json({ message: STRINGS.RESPONSES.NOT_FOUND });
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const data = await this.templatesService.remove(id);
    if (!data)
      return res.status(404).json({ message: STRINGS.RESPONSES.NOT_FOUND });
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data,
    });
  }
}
