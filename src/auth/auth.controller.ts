import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { QuickRegisterAuthDto } from './dto/quick-register-auth.dto';
import { UsersService } from 'src/users/users.service';
import { generateUsername } from 'src/common/helpers/generators';
import { ConfigsService } from 'src/configs/configs.service';
import STRINGS from 'src/common/consts/strings.json';
import { Request, Response } from 'express';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { TokensService } from 'src/auth/tokens/tokens.service';
import { BasicAuthGuard, Public } from './auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';
@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configsService: ConfigsService,
    private readonly tokensService: TokensService,
  ) {}

  @Get('me')
  me(@Req() req: Request, @Res() res: Response) {
    const me = { ...req['user'] };
    me['role'] = {
      name: me['role']['name'],
    };
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data: me,
    });
  }

  @Public()
  @UseGuards(BasicAuthGuard)
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
  @UseGuards(BasicAuthGuard)
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
  @UseGuards(BasicAuthGuard)
  @Post('login')
  async login(
    @Body() dto: LoginAuthDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
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
      req['client'],
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

  @Public()
  @UseGuards(BasicAuthGuard)
  @Post('refreshToken')
  async refreshToken(
    @Body() dto: RefreshTokenDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { refresh_token, access_token } =
      await this.tokensService.refreshToken(
        req['client'],
        dto.refresh_token,
        dto.deviceId,
      );
    return res.status(200).json({
      message: STRINGS.RESPONSES.SUCCESS,
      data: {
        token: {
          refresh_token,
          access_token,
        },
      },
    });
  }
}
