import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room, RoomSchema } from './rooms.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesService } from './messages/messages.service';
import { RoomsGateway } from './rooms.gateway';
import { UsersModule } from 'src/users/users.module';
import { CacheService } from 'src/cache/cache.service';
import { TokensModule } from 'src/auth/tokens/tokens.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    TokensModule,
    UsersModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService, MessagesService, RoomsGateway, CacheService],
  exports: [RoomsService],
})
export class RoomsModule {}
