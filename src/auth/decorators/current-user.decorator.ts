import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { CustomJwtPayload } from '@/common/types';

export const getUserFromContext = (data: unknown, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  return request.user as CustomJwtPayload;
};

export const CurrentUser = createParamDecorator(getUserFromContext);
