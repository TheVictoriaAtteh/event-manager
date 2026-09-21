import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import type { RequestUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const jwtSecret = config.get<string>('SUPABASE_JWT_SECRET');
    const supabaseUrl = config.get<string>('SUPABASE_URL')?.replace(/\/+$/, '');

    // Legacy Supabase projects use a shared HS256 JWT secret. Newer projects
    // issue asymmetric tokens, whose rotating public keys are published by
    // their own JWKS endpoint. Never use a hard-coded public key here.
    if (jwtSecret) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: jwtSecret,
        algorithms: ['HS256'],
      });
    } else if (supabaseUrl) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKeyProvider: passportJwtSecret({
          cache: true,
          cacheMaxEntries: 5,
          cacheMaxAge: 10 * 60 * 1000,
          rateLimit: true,
          jwksRequestsPerMinute: 10,
          jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
        }),
        algorithms: ['ES256', 'RS256'],
      });
    } else {
      // The app will report missing Supabase configuration during startup.
      // This explicit fallback avoids silently accepting an arbitrary token.
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: '__missing_supabase_jwt_configuration__',
        algorithms: ['HS256'],
      });
    }
  }

  async validate(payload: { sub: string }): Promise<RequestUser> {
    const user = await this.usersService.findBySupabaseUserId(payload.sub);
    if (!user) {
      throw new UnauthorizedException({
        message: 'User account not found',
        code: 'USER_NOT_FOUND',
      });
    }
    return {
      id: user.id,
      supabaseUserId: user.supabaseUserId,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  }
}
