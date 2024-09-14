import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User extends Base {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({})
  bio: string;

  @Prop({})
  avatar: string;

  @Prop({})
  deviceId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
