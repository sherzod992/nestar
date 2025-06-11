import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Message } from 'apps/nestar-api/src/libs/enums/common.enum';

@Injectable()
export class RolesGuard {
    constructor(
        private reflector: Reflector,
        private authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext | any): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) return true;

        console.info(`--- @guard() Authentication [RolesGuard]: ${roles} ---`);

        if (context.contextType === 'graphql') {
            const request = context.getArgByIndex(2).req;
            const bearerToken = request.headers.authorization;
            if (!bearerToken) throw new BadRequestException(Message.TOKEN_NOT_EXIST);

            const token = bearerToken.split(' ')[1];
            const authMember = await this.authService.verifyToken(token);
            const hasRole = () => roles.indexOf(authMember.memberType) > -1;
            const hasPermission: boolean = hasRole();

            if (!authMember || !hasPermission) {
                throw new ForbiddenException(Message.ONLY_SPECIFIC_ROLES_ALLOWED);
            }

            // 인증 성공 시 true 반환
            return true;
        }

        // GraphQL이 아닌 경우 기본적으로 false 반환
        return false;
    }
}