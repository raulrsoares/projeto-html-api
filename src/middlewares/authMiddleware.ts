import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errorHandler';

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

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new UnauthorizedError('chave de decrepitação invalida');
    }

    const decoded = jwt.verify(token, secret);

    (req as any).userInfo = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
