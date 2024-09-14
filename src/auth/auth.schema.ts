import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';
import { User } from 'src/users/users.schema';

export type AuthDocument = HydratedDocument<Auth>;
@Schema()
export class Auth extends Base {
  @Prop({
    type: { type: mongoose.Schema.Types.ObjectId, ref: User.name },
  })
  userId: string;

  @Prop({ required: true, unique: true })
  password: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
