import { Customer } from '@app/customers/schemas/customer.schema';
import { Service } from '@app/services/schemas/service.schema';
import { User } from '@app/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MangooseSchema, now } from 'mongoose';

export type ServiceCallDocument = HydratedDocument<ServiceCall>;

@Schema()
export class ServiceCall {
  @Prop({})
  mobileNumber: String;

  @Prop({})
  remarks: String;

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

  @Prop({
    type: MangooseSchema.Types.ObjectId,
    ref: User.name,
  })
  assignedToSecond: User;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: User.name })
  assignedTo: User;

  @Prop({ type: Date })
  assignedAt: String;

  @Prop({ type: Object })
  address: Object;

  @Prop({ type: Object })
  details: Object;
}

export const ServiceCallSchema = SchemaFactory.createForClass(ServiceCall);

export type ServiceCallDataDocument = HydratedDocument<ServiceCallData>;

@Schema()
export class ServiceCallData {
  @Prop({ type: MangooseSchema.Types.ObjectId, ref: ServiceCall.name })
  serviceCall: ServiceCall;

  @Prop({ type: [String] })
  files: String[];

  @Prop({ default: false })
  isCancel: Boolean;

  @Prop({ default: false })
  isStarted: Boolean;

  @Prop({ default: false })
  isInstallation: Boolean;

  @Prop({ default: false })
  isPending: Boolean;

  @Prop({ default: false })
  isCompleted: Boolean;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: Service.name })
  service: Service;

  @Prop({})
  remarks: String;

  @Prop({ type: Date })
  createdAt: String;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: User.name })
  createdBy: User;

  @Prop({ type: Date })
  uploadedAt: String;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: User.name })
  uploadedBy: User;

  @Prop({ type: Date })
  serviceDateAt: String;

  @Prop({ type: Object })
  details: Object;


  @Prop({
    type: MangooseSchema.Types.ObjectId,
    ref: User.name,
  })
  assignedToSecond: User;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: User.name })
  assignedTo: User;
}

export const ServiceCallDataSchema =
  SchemaFactory.createForClass(ServiceCallData);
