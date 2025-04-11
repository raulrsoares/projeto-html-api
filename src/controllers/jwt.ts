import {
  JwtPayloadApplication,
  RequestBody,
  ResponseBody,
} from '../models/auth';
import { NextFunction, Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ExpirationInType } from '../types/jwtTypes';
import userData from '../data/user';
import { UserInterface } from '../models/user';

const base64Secret = process.env.JWT_SECRET_BASE64 as string;
const expiration = process.env.JWT_EXPIRATION || '1H';

if (!base64Secret) {
  throw new Error('JWT_SECRET_BASE64 não definido no .env');
}

export class JwtServices {
  constructor() {}
  private secret: jwt.Secret = Buffer.from(base64Secret, 'base64');

  public generateSecretToken = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<any> => {
    try {
      const { email, senha }: RequestBody = req.body;
      if (!email) {
        res.status(400).json({ erro: 'email obrigatório' }).end();
      }
      if (!senha) {
        res.status(400).json({ erro: 'senha obrigatório' }).end();
      }

      const actual_user: UserInterface | undefined = userData.find(
        (element: any) => element.email == email && element.password == senha,
      );

      if (actual_user == undefined) {
        res.status(404).json({ erro: 'usuário não existente' }).end();
      }

      const token = await this.criarToken({
        sub: actual_user?._id as string,
        role: actual_user?.role as string,
      });

      const response: ResponseBody = {
        auth: token,
        role: actual_user?.role as string,
      };
      res.status(200).set('x-auth-token', token).json(response).end();
    } catch (error) {
      res
        .status(500)
        .json({ erro: JSON.stringify(error) })
        .end();
    }
  };

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
      expiresIn: expiration as ExpirationInType,
      algorithm: 'HS256',
    };

    return jwt.sign(payload, this.secret, options);
  }
}
