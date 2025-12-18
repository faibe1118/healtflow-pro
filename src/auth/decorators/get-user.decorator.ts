import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

export const CurrentUSer = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    //1. obtenemos la peticion HTTP
    const request = ctx.switchToHttp().getRequest<Request>();

    //2. extraemso el usuario (que puso el JwtStrategy ahí)
    const user = request.user;

    if (!user) {
      throw new InternalServerErrorException(
        'User not found in request (AuthGuard missing)?',
      );
    }

    //3. si pedimos un campo especifico (@CurrentUser('email)), lo devolvemos
    return data ? user[data] : user;
  },
);
