import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AtJWTStrategy, RtJWTStrategy } from './strategies';
import { CaslAbilityFactory } from './casl/ability.factory';
import { PermissionsGuard } from './guards/permissions.guard';
import { UsersModule } from '@app/users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      
    })
  ],
  providers: [
    AuthService,
    AtJWTStrategy,
    RtJWTStrategy,
    CaslAbilityFactory,
    PermissionsGuard,
  ],
  exports: [JwtModule, AuthService, CaslAbilityFactory, PermissionsGuard],
  controllers: [AuthController],
})
export class AuthModule {}
