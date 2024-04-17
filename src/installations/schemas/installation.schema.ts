import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MangooseSchema, now } from 'mongoose';
import { Customer } from '@app/customers/schemas/customer.schema';
import { User } from '@app/users/schemas/user.schema';
import { Service } from '@app/services/schemas/service.schema';
import { ServiceCall } from '@app/service-calls/schemas/service-call.schema';

export type InstallationDocument = HydratedDocument<Installation>;

@Schema()
export class Installation {
  @Prop({})
  mobileNumber: String;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: Service.name })
  service: Service;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: Customer.name })
  customer: Customer;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: User.name })
  createdBy: User;

  @Prop({ type: Date })
  nextServiceAt: String;

  @Prop({ type: Date, default: now() })
  createdAt: String;

  @Prop({ type: Date })
  updatedAt: String;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: User.name })
  assignedTo: User;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: User.name })
  assignedToSecond: User;

  @Prop({ type: Date })
  assignedAt: String;

  @Prop({ type: Object })
  address: Object;

  @Prop({ type: Boolean, default: false })
  completed: Boolean;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: ServiceCall.name })
  serviceCall: ServiceCall;

  @Prop({})
  remarks: String;

  @Prop({ type: Object })
  details: Object;
}

export const InstallationSchema = SchemaFactory.createForClass(Installation);
