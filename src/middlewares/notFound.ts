// middlewares/notFound.ts
import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from './errorHandler';

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(new NotFoundError(`Rota '${req.originalUrl}' não encontrada`));
};
