import { forwardRef, Module } from '@nestjs/common';
import { InstallationsService } from './installations.service';
import { InstallationsController } from './installations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Installation,
  InstallationSchema,
} from './schemas/installation.schema';
import {
  Customer,
  CustomerSchema,
} from '@app/customers/schemas/customer.schema';
import { Session, SessionSchema } from '@app/users/schemas/session.schema';
import { ServiceCallsModule } from '@app/service-calls/service-calls.module';
import { ServiceCall, ServiceCallData, ServiceCallDataSchema, ServiceCallSchema } from '@app/service-calls/schemas/service-call.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Installation.name, schema: InstallationSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: ServiceCall.name, schema: ServiceCallSchema },
      { name: ServiceCallData.name, schema: ServiceCallDataSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    forwardRef(() => ServiceCallsModule),
  ],
  controllers: [InstallationsController],
  providers: [InstallationsService],
  exports: [InstallationsService],
})
export class InstallationsModule { }
