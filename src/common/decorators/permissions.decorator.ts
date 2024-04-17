import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { RequiredPermission } from '../types';
import { PERMISSION_CHECKER_KEY } from '../constants';

export const CheckPermissions = (
  ...params: RequiredPermission
): CustomDecorator<string> => SetMetadata(PERMISSION_CHECKER_KEY, params);
