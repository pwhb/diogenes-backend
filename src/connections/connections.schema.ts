import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';

export type ConnectionDocument = HydratedDocument<Connection>;
@Schema({ timestamps: true })
export class Connection extends Base {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: string;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  friendId: string;
}

export const ConnectionSchema = SchemaFactory.createForClass(Connection);
