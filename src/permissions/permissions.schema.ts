import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';

export type PermissionDocument = HydratedDocument<Permission>;
@Schema()
export class Permission extends Base {
  @Prop()
  name: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  method: string;

  @Prop({ default: ['root'], type: [String] })
  allowedRoles: string[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
