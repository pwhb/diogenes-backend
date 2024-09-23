import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';
import { User } from 'src/users/users.schema';

export type ConnectionDocument = HydratedDocument<Connection>;
@Schema({ timestamps: true })
export class Connection extends Base {
  @Prop({ type: Types.ObjectId, ref: User.name })
  user1: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user2: Types.ObjectId;

  @Prop({ default: 'pending' })
  status: string;
}

export const ConnectionSchema = SchemaFactory.createForClass(Connection);
ConnectionSchema.index({ user1: 1, user2: 1 }, { unique: true });
