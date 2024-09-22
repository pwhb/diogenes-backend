import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';
import { User } from 'src/users/users.schema';

export type RoomDocument = HydratedDocument<Room>;
export enum RoomType {
  GROUP = 'GROUP',
  DIRECT = 'DIRECT',
  GAME = 'GAME',
}
@Schema({ timestamps: true })
export class Room extends Base {
  @Prop({ type: Object })
  metadata: {
    icon?: string;
    name?: string;
  };

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
  })
  participants: Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
  })
  admins: Types.ObjectId[];

  @Prop({ required: true })
  type: RoomType;

  @Prop({ required: true, default: 'private' })
  visibility: string;

  @Prop({ required: true, default: 'inactive' })
  status: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
