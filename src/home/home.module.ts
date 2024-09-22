import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { TemplatesModule } from 'src/templates/templates.module';
import { UsersModule } from 'src/users/users.module';
import { ConnectionsModule } from 'src/connections/connections.module';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [TemplatesModule, UsersModule, ConnectionsModule, RoomsModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
