import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';
import { ConfigType, TConfig } from './dto/create-config.dto';

export type ConfigDocument = HydratedDocument<Config>;
@Schema()
export class Config extends Base {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: 'STRING' })
  type: ConfigType;

  @Prop({ type: {}, default: '' })
  value: any;

  @Prop({ type: Array, default: [] })
  subConfigs: TConfig[];
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
