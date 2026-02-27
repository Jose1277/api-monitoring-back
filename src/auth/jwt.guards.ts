import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuardUser extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        } else if (!authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Invalid authorization header format');
        } else {
        }

        return super.canActivate(context);
    }

    handleRequest(err, user, info, context) {
        if (err) {
            throw err;
        }
        if (!user) {
            throw new UnauthorizedException(info?.message || 'Unauthorized');
        }
        return user;
    }
}