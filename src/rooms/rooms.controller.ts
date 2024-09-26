import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Response } from 'express';
import STRINGS from 'src/common/consts/strings.json';
import { parseQuery, QueryType } from 'src/common/db/query';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('rooms')
@Controller('api/v1/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}
  // @Post()
  // async create(@Body() dto: CreateRoomDto, @Res() res: Response) {
  //   const data = await this.roomsService.create(dto);
  //   return res.status(200).json({
  //     message: STRINGS.RESPONSES.SUCCESS,
  //     data,
  //   });
  // }

  @Get()
  async findMany(@Query() query: any, @Res() res: Response) {
    const { skip, limit, page, sort, filter } = parseQuery(query, [
      {
        key: 'q',
        type: QueryType.Regex,
        searchedFields: ['name'],
      },
    ]);

    const { count, data } = await this.roomsService.findMany({
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
    const data = await this.roomsService.findOne(id);
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
    @Body() dto: UpdateRoomDto,
    @Res() res: Response,
  ) {
    const data = await this.roomsService.update(id, dto);
    if (!data)
      return res.status(404).json({ message: STRINGS.RESPONSES.NOT_FOUND });
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const data = await this.roomsService.remove(id);
    if (!data)
      return res.status(404).json({ message: STRINGS.RESPONSES.NOT_FOUND });
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data,
    });
  }
}
