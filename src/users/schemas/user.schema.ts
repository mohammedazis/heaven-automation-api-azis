import { Branch } from '@app/branches/schemas/branch.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MangooseSchema, now } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: String;

  @Prop()
  type: String;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: User.name })
  createdBy: User;

  @Prop({ type: MangooseSchema.Types.ObjectId, ref: Branch.name })
  branch: Branch;

  @Prop({ type: Date, default: now() })
  createdAt: String;

  @Prop({ unique: true, required: true })
  mobileNumber: String;

  @Prop({ type: Date })
  lastLoginAt: String;

  @Prop({ type: Date })
  passwordUpdatedAt: String;

  @Prop({})
  password: string;

  @Prop({ nullable: true })
  rememberToken: string;

  @Prop({ type: [String], default: [] })
  permissions: String[];

  @Prop({ default: true })
  isActive: Boolean;

  @Prop({ type: Object })
  address: Object;
}

export const UserSchema = SchemaFactory.createForClass(User);
