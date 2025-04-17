import {
  JwtPayloadApplication,
  RequestBody,
  ResponseBody,
} from '../models/auth';
import { NextFunction, Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { StringValue } from 'ms';
import { v4 as uuidv4 } from 'uuid';
import prismaClient from '../prisma/prisma';
import { NotFoundError, UnauthorizedError } from '../middlewares/errorHandler';

const base64Secret = process.env.JWT_SECRET_BASE64 as string;
const expiration = process.env.JWT_EXPIRATION || '15m';

if (!base64Secret || !expiration) {
  throw new Error('JWT_SECRET_BASE64 ou JWT_EXPIRATION não definido no .env');
}

export class JwtServices {
  private secret: jwt.Secret = Buffer.from(base64Secret, 'base64');

  constructor() {
    this.generateSecretToken = this.generateSecretToken.bind(this);
  }

  async generateSecretToken(
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<any> {
    const { email, senha }: RequestBody = req.body;

    if (!email || !senha) {
      throw new NotFoundError('preencha todos os campos');
    }

    const findCostumer = await prismaClient.customer.findFirst({
      where: { email: email, password: senha },
    });

    if (!findCostumer) {
      throw new UnauthorizedError('usuário não existe');
    }

    const token = await this.criarToken({
      sub: findCostumer.id,
      role: findCostumer.role,
    });

    const response: ResponseBody = {
      authorization: `Bearer ${token}`,
      role: findCostumer.role,
      id: findCostumer.id,
    };
    return res
      .status(200)
      .set('x-auth-token', `Bearer ${token}`)
      .json(response);
  }

  private async criarToken({
    sub,
    role,
  }: JwtPayloadApplication): Promise<string> {
    const payload: JwtPayloadApplication = {
      sub,
      role,
      jti: uuidv4(),
    };

    const options: SignOptions = {
      expiresIn: expiration as StringValue,
      algorithm: 'HS256',
    };

    return jwt.sign(payload, this.secret, options);
  }
}
