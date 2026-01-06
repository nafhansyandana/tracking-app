import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { requireEnv } from '../config/env';

function jwtExpiresInSeconds(): number {
  const raw = process.env.JWT_EXPIRES_IN ?? '86400';
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 86400; // default 1 hari
  return n;
}

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: requireEnv('JWT_SECRET'),
      signOptions: {
        expiresIn: jwtExpiresInSeconds(),
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
