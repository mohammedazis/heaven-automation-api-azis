import { Permissions } from '@app/common/constants';
import { PermissionObjectType } from '@app/common/types';
import { User } from '@app/users/schemas/user.schema';
import { UsersService } from '@app/users/users.service';
import { Ability } from '@casl/ability';
import { Injectable } from '@nestjs/common';

interface CaslPermission {
  action: Permissions;
  subject: string;
}

@Injectable()
export class CaslAbilityFactory {
  constructor(private userService: UsersService) {}

  async abilityPermissionsUser(user: User) {
    const permissions = await this.userService.getPermissions(user.mobileNumber);
    const caslPermissions: CaslPermission[] = permissions.map((permission) => {
      const splitted = permission.split(':');

      return {
        action: splitted[0] as Permissions,
        subject: splitted[1],
      };
    });
    return new Ability<[Permissions, PermissionObjectType]>(caslPermissions);
  }
}
