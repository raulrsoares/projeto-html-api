import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const authenticate: RequestHandler = (
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
    const secret = process.env.JWT_SECRET || 'segredo';
    const decoded = jwt.verify(token, secret);
    (req as JwtPayload).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};
