import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginAuthDto) {
    const { email, password } = loginDto;

    // 1. Buscar al usuario por email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Nunca digas "Usuario no encontrado" por seguridad. Di "Credenciales inválidas".
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Verificar la contraseña (Comparar texto plano con Hash)
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Generar el Payload (La información que va DENTRO del token)
    const payload = {
      sub: user.id, // 'sub' es estándar para el ID del usuario
      email: user.email,
      role: user.role,
    };

    // 4. Firmar y devolver el Token
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        // Opcional: devolver datos básicos del usuario
        email: user.email,
        role: user.role,
      },
    };
  }
}
