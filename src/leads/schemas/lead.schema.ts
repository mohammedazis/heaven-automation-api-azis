import { Customer } from '@app/customers/schemas/customer.schema';
import { Service } from '@app/services/schemas/service.schema';
import { User } from '@app/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MangooseSchema, now } from 'mongoose';

export type LeadDocument = HydratedDocument<Lead>;

@Schema()
export class Lead {
  @Prop([{ type: MangooseSchema.Types.ObjectId, ref: Service.name }])
  services: Service[];

  @Prop({})
  companyName: String;

  @Prop({})
  reference: String;

  @Prop({})
  description: String;

  @Prop({})
  priority: String;

  @Prop({ type: Date })
  nextFollowUpAt: String;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: User.name })
  assignedTo: User;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: User.name })
  assignedBy: User;

  @Prop({ type: Date, default: now() })
  assignedAt: String;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: User.name })
  updatedBy: User;

  @Prop({ type: Date, default: now() })
  updatedAt: String;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: User.name })
  createdBy: User;

  @Prop({ type: Date, default: now() })
  createdAt: String;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: Customer.name })
  customer: Customer;

  @Prop({ type: Object, unique: true })
  contactPerson: Object;

  @Prop({ type: Object })
  customAddress: Object;

  @Prop({ type: Object })
  address: Object;

  @Prop({ type: Boolean, default: false })
  liveLocation: Boolean;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: User.name })
  convertedBy: User;

  @Prop({ type: Date })
  convertedAt: String;

  @Prop({ type: Boolean, default: false })
  converted: Boolean;

  @Prop({ type: [String] })
  files: String[];
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
