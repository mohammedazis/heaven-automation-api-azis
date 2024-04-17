import { Module, forwardRef } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lead, LeadSchema } from './schemas/lead.schema';
import { CustomersModule } from '@app/customers/customers.module';
import { Session, SessionSchema } from '@app/users/schemas/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lead.name, schema: LeadSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    forwardRef(() => CustomersModule),
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
