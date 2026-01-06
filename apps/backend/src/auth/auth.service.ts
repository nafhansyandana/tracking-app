import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email atau password salah');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Email atau password salah');

    const payload = { sub: user.id, role: user.role, email: user.email };
    const access_token = await this.jwt.signAsync(payload);

    return {
      access_token,
      user: { id: user.id, nik: user.nik, name: user.name, email: user.email, role: user.role },
    };
  }

  async adminCreateUser(input: { nik: string; name: string; email: string; password: string; role: Role }) {
    const existing = await this.users.findByEmail(input.email);
    if (existing) throw new ConflictException('Email sudah terdaftar');

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await this.users.createUser({
      nik: input.nik,
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });

    return { id: user.id, nik: user.nik, name: user.name, email: user.email, role: user.role };
  }
}
