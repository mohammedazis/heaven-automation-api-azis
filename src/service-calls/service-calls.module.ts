import { forwardRef, Module } from '@nestjs/common';
import { ServiceCallsService } from './service-calls.service';
import { ServiceCallsController } from './service-calls.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceCall, ServiceCallData, ServiceCallDataSchema, ServiceCallSchema } from './schemas/service-call.schema';
import { Session, SessionSchema } from '@app/users/schemas/session.schema';
import { InstallationsModule } from '@app/installations/installations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceCall.name, schema: ServiceCallSchema },
      { name: Session.name, schema: SessionSchema },
      { name: ServiceCallData.name, schema: ServiceCallDataSchema }
    ]),
    forwardRef(() => InstallationsModule),
  ],
  controllers: [ServiceCallsController],
  providers: [ServiceCallsService],
  exports: [ServiceCallsService],
})
export class ServiceCallsModule { }
