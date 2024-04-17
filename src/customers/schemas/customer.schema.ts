import { User } from '@app/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MangooseSchema, now } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
export class Customer {
  _id: MangooseSchema.Types.ObjectId

  @Prop({ required: true })
  name: String;

  @Prop({ unique: true, required: true })
  mobileNumber: String;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: User.name })
  createdBy: User;

  @Prop({ type: Date, default: now() })
  createdAt: String;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
