import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MangooseSchema, now } from 'mongoose';

export type BranchDocument = HydratedDocument<Branch>;

@Schema()
export class Branch {
  @Prop({})
  name: String;
  
  @Prop({})
  branchName: String;

  @Prop({ type: Date })
  createdAt: String;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
