import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { QuickRegisterAuthDto } from './dto/quick-register-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { generateUsername } from 'src/common/helpers/generators';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('quick-register')
  async create(@Body() dto: QuickRegisterAuthDto) {
    let username = null;
    let created = null;
    while (!created) {
      username = generateUsername();
      created = await this.usersService.create({
        username: username,
        deviceId: dto.deviceId,
      });
    }
    return created;
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
