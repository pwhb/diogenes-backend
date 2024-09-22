import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';
import { User } from 'src/users/users.schema';

export type RoomDocument = HydratedDocument<Room>;
@Schema({ timestamps: true })
export class Room extends Base {
  @Prop({ type: Object })
  metadata: {
    icon?: string;
    name?: string;
    isGroup?: boolean;
  };

  @Prop({
    type: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: User.name },
        role: { type: String, default: 'member' },
        status: { type: String, default: 'pending' },
      },
    ],
  })
  participants: string[];

  @Prop({ required: true, default: 'chat' })
  type: string;

  @Prop({ required: true, default: 'private' })
  visibility: string;

  @Prop({ required: true, default: 'inactive' })
  status: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
