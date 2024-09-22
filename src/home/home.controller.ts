import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';
import { ApiTags } from '@nestjs/swagger';
import { TemplatesService } from 'src/templates/templates.service';

@ApiTags('home')
@Controller('api/v1/home')
export class HomeController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get('games')
  getGames() {
    return this.templatesService.findAll({
      filter: {
        type: 'game',
      },
    });
  }
}
