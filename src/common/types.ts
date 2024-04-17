import { Ability, MongoAbility } from '@casl/ability';
import { Permissions, Objects } from './constants';

export type PermissionObjectType = any;
export type AppAbility = MongoAbility<[Permissions, PermissionObjectType]>;
export type RequiredPermission = [Permissions, PermissionObjectType];

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export enum Priorities {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum UserTypes {
  Admin = 'admin',
  ServicePerson = 'servicePerson',
  MarketingPerson = 'marketingPerson',
}
