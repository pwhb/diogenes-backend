import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';
import { User } from 'src/users/users.schema';

export type NotificationDocument = HydratedDocument<Notification>;
@Schema({ timestamps: true })
export class Notification extends Base {
  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: string;

  @Prop({ type: Object })
  config: {
    params: string[];
    init: string;
  };
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
