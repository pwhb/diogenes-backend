import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';

export type LangString = {
  [key: string]: string;
};

export enum TemplateType {
  GAME = 'GAME',
  MESSAGE = 'MESSAGE',
  NOTIFICATION = 'NOTIFICATION',
}

export type TemplateDocument = HydratedDocument<Template>;
@Schema({ timestamps: true })
export class Template extends Base {
  @Prop({ required: true, type: Object })
  name: LangString;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  type: TemplateType;

  @Prop({ required: true, default: 'inactive' })
  status: string;

  @Prop({ type: Object })
  config: {
    params: string[];
    actions: {
      name: string;
      action: string;
      params: string[];
    }[];
    init: string;
  };

  @Prop({ type: Object })
  metadata: {
    icon?: string;
    image?: string;
    description?: LangString;
    rules?: LangString;
    messageTemplate?: LangString;
    gameModes?: string[];
    playersOptions?: string[];
  };
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
