import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {Role} from '@prisma/client';
import {ROLES_KEY} from '../constants/index.constant';
import {RequestWithUser} from '../types/index.type';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const {user} = context.switchToHttp().getRequest<RequestWithUser>();

        if (!user) {
            throw new ForbiddenException('Пользователь не авторизован');
        }

        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) {
            throw new ForbiddenException('Недостаточно прав доступа');
        }

        return true;
    }
}