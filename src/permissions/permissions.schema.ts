import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';

export type PermissionDocument = HydratedDocument<Permission>;
@Schema({ timestamps: true })
export class Permission extends Base {
  @Prop({ required: true, unique: true })
  name: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
