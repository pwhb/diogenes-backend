import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { TemplatesModule } from 'src/templates/templates.module';

@Module({
  imports: [TemplatesModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
