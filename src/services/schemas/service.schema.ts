import { User } from '@app/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MangooseSchema, now, SchemaType } from 'mongoose';

export type ServiceDocument = HydratedDocument<Service>;

@Schema()
export class Service {
  _id: MangooseSchema.Types.ObjectId

  @Prop({ required: true, unique: true })
  name: String;

  @Prop({ required: true, unique: true })
  slug: String;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: User.name })
  createdBy: User;

  @Prop({ type: Date, default: now() })
  createdAt: String;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
