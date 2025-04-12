import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errorHandler';
const base64Secret = process.env.JWT_SECRET_BASE64 as string;

if (!base64Secret) {
  throw new Error('JWT_SECRET_BASE64 não definido no .env');
}

export const jwtAuth: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token não fornecido');
  }

  const token = authHeader.split(' ')[1];

  const secret: jwt.Secret = Buffer.from(base64Secret, 'base64');

  if (!secret) {
    throw new UnauthorizedError('chave de decrepitação invalida');
  }

  const decoded = jwt.verify(token, secret);

  (req as any).userInfo = decoded;
  next();
};
