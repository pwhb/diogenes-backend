import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
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
import { RoomType } from 'src/rooms/rooms.schema';
import { CreateGroupDto } from './dto/create-group.dto';
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
    const { count, data } = await this.templatesService.findMany({
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

  @Get('friends')
  async getFriendList(
    @Req() req: Request,
    @Query() query: any,
    @Res() res: Response,
  ) {
    const reqUserId = new Types.ObjectId(req['user']['_id'] as string);
    let data: any;
    if (query.status === 'sent') {
      const sent = await this.connectionsService.findMany({
        filter: {
          user1: reqUserId,
          status: 'pending',
        },
      });
      data = {
        status: 'sent',
        count: sent.count,
        data: sent.data.map((v) => v.user2),
      };
    } else if (query.status === 'received') {
      const received = await this.connectionsService.findMany({
        filter: {
          user2: reqUserId,
          status: 'pending',
        },
      });
      data = {
        status: 'received',
        count: received.count,
        data: received.data.map((v) => v.user1),
      };
    } else {
      const friends = await this.connectionsService.findMany({
        filter: {
          $or: [{ user1: reqUserId }, { user2: reqUserId }],
          status: 'friends',
        },
      });
      data = {
        status: 'friends',
        count: friends.count,
        data: this.connectionsService.getFriendList(reqUserId, friends.data),
      };
    }
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data: data,
    });
  }

  @Get('rooms')
  async getRoomList(
    @Req() req: Request,
    // @Query() query: any,
    @Res() res: Response,
  ) {
    const reqUserId = new Types.ObjectId(req['user']['_id'] as string);
    const { data, count } = await this.roomsService.getRoomList(reqUserId);

    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      count,
      data: data,
    });
  }

  @Post('rooms')
  async createGroup(
    @Req() req: Request,
    @Body() dto: CreateGroupDto,
    @Res() res: Response,
  ) {
    const reqUserId = req['user']['_id'];
    const friendIds = dto.friendIds;
    const { data } = await this.connectionsService.findMany({
      filter: {
        $or: [{ user1: reqUserId }, { user2: reqUserId }],
        status: 'friends',
      },
    });
    const friends = this.connectionsService.getFriendList(reqUserId, data);
    const participants = [reqUserId, ...friendIds].filter((id) =>
      friends.some((friend) => friend._id.toString() === id.toString()),
    );

    const created = await this.roomsService.create({
      participants: participants,
      type: RoomType.GROUP,
      admins: [reqUserId],
      metadata: {
        name: dto.name,
        icon: dto.icon,
      },
      visibility: dto.visibility,
      status: 'active',
    });
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data: created,
    });
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
    let status = 'strangers';

    const connection = await this.connectionsService.findOne({
      $or: [
        { user1: reqUserId, user2: user._id },
        { user1: user._id, user2: reqUserId },
      ],
    });

    if (connection) {
      status = connection.status;
      if (status === 'pending') {
        status =
          connection.user1.toString() === reqUserId.toString()
            ? 'sent'
            : 'received';
      }
    }

    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data: {
        user: user,
        status: status,
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
    if (reqUserId.toString() === friendId.toString()) {
      return res.status(400).json({
        message: STRINGS.RESPONSES.SAME_USER,
      });
    }
    const alreadyExists = await this.connectionsService.findOne({
      $or: [
        { user1: reqUserId, user2: friendId },
        { user1: friendId, user2: reqUserId },
      ],
    });

    if (alreadyExists) {
      return res.status(400).json({
        message: STRINGS.RESPONSES.ALREADY_ADDED,
      });
    }

    const data = await this.connectionsService.create({
      user1: reqUserId,
      user2: friendId,
      status: 'pending',
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
    const connection = await this.connectionsService.findOne({
      user1: friendId,
      user2: reqUserId,
      status: 'pending',
    });

    if (!connection) {
      return res.status(404).json({
        message: STRINGS.RESPONSES.NOT_FOUND,
      });
    }

    await this.connectionsService.update(connection._id, {
      status: 'friends',
    });
    await this.roomsService.createFriendChat({
      participants: [friendId, reqUserId],
    });

    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
    });
  }
}
