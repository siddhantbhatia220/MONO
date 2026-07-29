/**
 * MONO — JWT Authentication Guard
 *
 * Protects NestJS endpoints requiring valid Bearer tokens.
 */
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<T>(err: Error | null, user: T): T {
    if (err || !user) {
      throw new UnauthorizedException('Authentication required')
    }
    return user
  }
}
