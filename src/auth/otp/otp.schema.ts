import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';
import { User } from 'src/users/users.schema';

export type OtpDocument = HydratedDocument<Otp>;
@Schema({ timestamps: true })
export class Otp extends Base {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  code: string;

  @Prop({ type: Date })
  expiredAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
