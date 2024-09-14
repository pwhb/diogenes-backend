import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';

export type ConfigDocument = HydratedDocument<Config>;
@Schema()
export class Config extends Base {
  @Prop({ required: true, unique: true })
  name: string;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
