import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';
import { User } from 'src/users/users.schema';

export type ConnectionDocument = HydratedDocument<Connection>;
@Schema({ timestamps: true })
export class Connection extends Base {
  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: string;
  @Prop({ type: Types.ObjectId, ref: User.name })
  friendId: string;
}

export const ConnectionSchema = SchemaFactory.createForClass(Connection);
ConnectionSchema.index({ userId: 1, friendId: 1 }, { unique: true });
