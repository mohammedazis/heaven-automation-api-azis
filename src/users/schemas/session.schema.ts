import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MangooseSchema, now } from 'mongoose';
import { User } from './user.schema';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
  @Prop({ type: MangooseSchema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({})
  type: String;

  @Prop({ type: Date })
  expiresAt: Date;

  @Prop({ type: Boolean })
  fresh: boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
