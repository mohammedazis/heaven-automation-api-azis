export const IS_PUBLIC_KEY = 'isPublic';
export const PERMISSION_CHECKER_KEY = 'permission_checker_casl';

export enum Permissions {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export enum Objects {
  Customers = 'customers',
  Installations = 'installations',
  Services = 'services',
  ServiceCalls = 'serviceCalls',
  Users = 'users',
  Leads = 'leads',
}
