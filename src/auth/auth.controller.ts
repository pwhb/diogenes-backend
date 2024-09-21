import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { QuickRegisterAuthDto } from './dto/quick-register-auth.dto';
import { UsersService } from 'src/users/users.service';
import { generateUsername } from 'src/common/helpers/generators';
import { ConfigsService } from 'src/configs/configs.service';
import STRINGS from 'src/common/consts/strings.json';
import { Response } from 'express';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { TokensService } from 'src/tokens/tokens.service';
import { Public } from './auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configsService: ConfigsService,
    private readonly tokensService: TokensService,
  ) {}

  @Public()
  @Post('quick-register')
  async quickRegister(@Body() dto: QuickRegisterAuthDto, @Res() res: Response) {
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

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterAuthDto, @Res() res: Response) {
    const USER_ROLE = await this.configsService.get('USER_ROLE');
    const playerRoleId = USER_ROLE.value['player'];

    const prev = await this.usersService.findUser({ username: dto.username });
    if (prev) {
      return res.status(400).json({
        message: STRINGS.RESPONSES.USER_ALREADY_EXISTS,
      });
    }

    const created = await this.usersService.create({
      username: dto.username,
      deviceId: dto.deviceId,
      roleId: playerRoleId,
      status: 'active',
    });

    if (created._id) {
      await this.authService.create({
        userId: created._id,
        password: dto.password,
      });
      return res.status(201).json({
        message: STRINGS.RESPONSES.SUCCESS,
        data: created,
      });
    }

    return res.status(400).json({
      message: STRINGS.RESPONSES.DUPLICATE_KEY_ERROR,
    });
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginAuthDto, @Res() res: Response) {
    const user = await this.usersService.findUser({ username: dto.username });
    if (!user || user.status !== 'active') {
      return res.status(404).json({
        message: STRINGS.RESPONSES.USER_NOT_FOUND,
      });
    }
    const isValid = await this.authService.verify({
      userId: user._id,
      password: dto.password,
    });
    if (!isValid) {
      return res.status(400).json({
        message: STRINGS.RESPONSES.INVALID_PASSWORD,
      });
    }
    const { refresh_token, access_token } = await this.tokensService.signin(
      user._id,
      dto,
    );
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data: {
        user: user,
        token: {
          refresh_token,
          access_token,
        },
      },
    });
  }

  @Get('me')
  me() {
    return 'me';
  }
}
