import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';
import { User } from 'src/users/users.schema';
import { Room } from '../rooms.schema';

export type MessageDocument = HydratedDocument<Message>;
@Schema({ timestamps: true })
export class Message extends Base {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  senderId: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Room.name,
  })
  roomId: string;

  @Prop({ required: true, default: 'chat' })
  type: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId })
  refId?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
