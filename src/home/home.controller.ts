import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
// import { HomeService } from './home.service';
import { ApiTags } from '@nestjs/swagger';
import { TemplateType } from 'src/templates/templates.schema';
import { TemplatesService } from 'src/templates/templates.service';
import { UsersService } from 'src/users/users.service';
import STRINGS from 'src/common/consts/strings.json';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { ConnectionsService } from 'src/connections/connections.service';
import { RoomsService } from 'src/rooms/rooms.service';
@ApiTags('home')
@Controller('api/v1/home')
export class HomeController {
  constructor(
    private readonly templatesService: TemplatesService,
    private readonly usersService: UsersService,
    private readonly connectionsService: ConnectionsService,
    private readonly roomsService: RoomsService,
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
    const reqUserId = new Types.ObjectId(req['user']['_id'] as string);
    const user = await this.usersService.findUser({
      username: username,
      status: 'active',
      _id: {
        $ne: reqUserId,
      },
    });
    if (!user)
      return res.status(404).json({ message: STRINGS.RESPONSES.NOT_FOUND });
    const connections = await this.connectionsService.getConnections([
      reqUserId,
      user._id,
    ]);
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data: {
        user: user,
        connections: connections,
      },
    });
  }

  @Post('friends/add')
  async sendFriendRequest(
    @Req() req: Request,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const reqUserId = new Types.ObjectId(req['user']['_id'] as string);
    const friendId = new Types.ObjectId(body.friendId as string);
    const data = await this.connectionsService.create({
      userId: reqUserId,
      friendId: friendId,
    });
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data: data,
    });
  }

  @Post('friends/accept')
  async acceptFriendRequest(
    @Req() req: Request,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const reqUserId = new Types.ObjectId(req['user']['_id'] as string);
    const friendId = new Types.ObjectId(body.friendId as string);
    if (
      await this.connectionsService.isRequestSent({
        userId: friendId,
        friendId: reqUserId,
      })
    ) {
      await this.connectionsService.create({
        userId: reqUserId,
        friendId: friendId,
      });
      await this.roomsService.createFriendChat({
        participants: [friendId, reqUserId],
      });

      return res.status(200).json({
        message: STRINGS.RESPONSES.SUCCESS,
      });
    }
    return res.status(404).json({
      message: STRINGS.RESPONSES.NOT_FOUND,
    });
  }
}
