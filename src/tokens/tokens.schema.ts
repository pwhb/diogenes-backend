import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Base } from 'src/common/schema/base.schema';

export type TokenDocument = HydratedDocument<Token>;
@Schema()
export class Token extends Base {
    @Prop()
    deviceId: string;

    @Prop()
    token: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ type: Date })
    expiredAt: Date;

    @Prop()
    rememberMe: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);