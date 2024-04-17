import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetCurrentUserID = createParamDecorator(
  (_: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user['id'];
  },
);

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
