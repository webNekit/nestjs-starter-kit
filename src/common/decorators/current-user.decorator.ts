import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../types/index.type';

export const CurrentUser = createParamDecorator(
    (data: keyof RequestWithUser['user'] | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<RequestWithUser>();
        const user = request.user;

        if (!user) {
            return null;
        }

        return data ? user[data] : user;
    },
);