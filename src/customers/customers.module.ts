import { Module, forwardRef } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { LeadsModule } from '@app/leads/leads.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    forwardRef(() => LeadsModule),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
