import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room, RoomSchema } from './rooms.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesService } from './messages/messages.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, MessagesService],
  exports: [RoomsService],
})
export class RoomsModule {}
