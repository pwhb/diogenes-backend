import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';
import { Role } from 'src/roles/roles.schema';

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User extends Base {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Role.name,
    required: true,
  })
  roleId: string;

  @Prop({})
  bio: string;

  @Prop({})
  avatar: string;

  @Prop({ required: true })
  deviceId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('role', {
  ref: Role.name,
  localField: 'roleId',
  foreignField: '_id',
  justOne: true,
});
