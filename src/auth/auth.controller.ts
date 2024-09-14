import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { QuickRegisterAuthDto } from './dto/quick-register-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { generateUsername } from 'src/common/helpers/generators';
import { ConfigsService } from 'src/configs/configs.service';
import STRINGS from 'src/common/consts/strings.json';
import { Response } from 'express';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configsService: ConfigsService,
  ) {}

  @Post('quick-register')
  async create(@Body() dto: QuickRegisterAuthDto, @Res() res: Response) {
    const USER_ROLE = await this.configsService.get('USER_ROLE');
    const guestRoleId = USER_ROLE.value['guest'];

    const prev = await this.usersService.findUser({ deviceId: dto.deviceId });
    if (prev) {
      if (prev.roleId.toString() === guestRoleId) {
        return res.status(200).json({
          message: STRINGS.RESPONSES.SUCCESS,
          data: prev,
        });
      } else {
        return res.status(400).json({
          message: STRINGS.RESPONSES.USER_ALREADY_EXISTS,
        });
      }
    }

    const username = generateUsername();
    const created = await this.usersService.create({
      username: username,
      deviceId: dto.deviceId,
      roleId: guestRoleId,
    });

    if (created._id) {
      return res.status(201).json({
        message: STRINGS.RESPONSES.SUCCESS,
        data: created,
      });
    }

    return res.status(400).json({
      message: STRINGS.RESPONSES.DUPLICATE_KEY_ERROR,
    });
  }

  @Get('me')
  me() {
    return 'me';
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
