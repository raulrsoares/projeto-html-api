import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const jwtAuth: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      res.status(401).json({ error: 'chave de decrepitação invalida' });
      return;
    }

    const decoded = jwt.verify(token, secret);
    (req as any).userInfo = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};
