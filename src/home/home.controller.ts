import { Controller, Get, Param, Req, Res } from '@nestjs/common';
// import { HomeService } from './home.service';
import { ApiTags } from '@nestjs/swagger';
import { TemplateType } from 'src/templates/templates.schema';
import { TemplatesService } from 'src/templates/templates.service';
import { UsersService } from 'src/users/users.service';
import STRINGS from 'src/common/consts/strings.json';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
@ApiTags('home')
@Controller('api/v1/home')
export class HomeController {
  constructor(
    private readonly templatesService: TemplatesService,
    private readonly usersService: UsersService,
  ) {}

  @Get('games')
  async getGames() {
    const { count, data } = await this.templatesService.findAll({
      filter: {
        type: TemplateType.GAME,
        status: 'active',
      },
    });
    return {
      message: STRINGS.RESPONSES.SUCCESS,
      count,
      data,
    };
  }

  @Get('friends/:username')
  async findFriends(
    @Param('username') username: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.usersService.findUser({
      username: username,
      status: 'active',
      _id: { $ne: new Types.ObjectId(req['user']['_id'] as string) },
    });
    if (!user)
      return res.status(404).json({ message: STRINGS.RESPONSES.NOT_FOUND });
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data: {
        user: user,
      },
    });
  }
}
