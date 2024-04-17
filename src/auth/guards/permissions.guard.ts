import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/ability.factory';
import { AppAbility, RequiredPermission } from '@app/common/types';
import { IS_PUBLIC_KEY, PERMISSION_CHECKER_KEY } from '@app/common/constants';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: CaslAbilityFactory,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.get<RequiredPermission[]>(
        PERMISSION_CHECKER_KEY,
        context.getHandler(),
      ) || [];

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const token = context.switchToHttp().getRequest().headers.authorization;
    if (!token) {
      throw new UnauthorizedException();
    }
    const user = await this.validateToken(token);
    const ability = await this.abilityFactory.abilityPermissionsUser(user);
    return requiredPermissions.every((permission) =>
      this.isAllowed(ability, permission),
    );
  }

  async validateToken(token: string) {
    const currentTimeStamp = new Date().getTime() / 1000;
    try {
      const verified = await this.jwtService.verifyAsync(
        token.replace('Bearer ', ''),
      );
      if (verified.exp < currentTimeStamp) throw new UnauthorizedException();
      return verified;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private isAllowed(
    ability: AppAbility,
    permission: RequiredPermission,
  ): boolean {
    return ability.can(...permission);
  }
}
