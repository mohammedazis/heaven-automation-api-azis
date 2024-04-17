import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from './schemas/branch.schema';
import { SessionSchema, Session } from '@app/users/schemas/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Branch.name, schema: BranchSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [BranchesController],
  providers: [BranchesService],
  exports: [BranchesService],
})
export class BranchesModule {}
