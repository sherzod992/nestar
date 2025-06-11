import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class WithoutGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(context: ExecutionContext | any): Promise<boolean> {
        console.info('--- @guard() Authentication [WithoutGuard] ---');

        if (context.contextType === 'graphql') {
            const request = context.getArgByIndex(2).req;
            const bearerToken = request.headers.authorization;

            if (bearerToken) {
                try {
                    const token = bearerToken.split(' ')[1];
                    const authMember = await this.authService.verifyToken(token);
                    request.body.authMember = authMember;
                    return true; // 인증 성공 시 true 반환
                } catch (err) {
                    request.body.authMember = null;
                    return false; // 인증 실패 시 false 반환
                }
            }
            return false; // 토큰이 없을 경우 false 반환
        }

        // GraphQL이 아닌 경우 기본적으로 false 반환
        return false;
    }
}