import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Decimos de dónde sacar el token (del Header 'Authorization: Bearer ...')
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Si el token expiró, rechazar la petición
      secretOrKey: process.env.JWT_SECRET || 'secretKey', // La misma clave del AuthModule
    });
  }

  // 2. Si el token es válido, esta función se ejecuta y mete los datos en 'request.user'
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
