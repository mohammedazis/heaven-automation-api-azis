import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadsModule } from './leads/leads.module';
import { ServicesModule } from './services/services.module';
import { ServiceCallsModule } from './service-calls/service-calls.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { InstallationsModule } from './installations/installations.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SettingsModule } from './settings/settings.module';
// import { APP_GUARD } from '@nestjs/core';
// import { PermissionsGuard } from './auth/guards/permissions.guard';
import { BranchesModule } from './branches/branches.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads'
    }),
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'heaven-automation',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
    AuthModule,
    LeadsModule,
    ServicesModule,
    ServiceCallsModule,
    UsersModule,
    CustomersModule,
    SettingsModule,
    InstallationsModule,
    BranchesModule,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: PermissionsGuard,
    // },
  ],
})
export class AppModule { }
