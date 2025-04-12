import { Request, Response, NextFunction } from 'express';
export const timeLog = (_req: Request, _res: Response, next: NextFunction) => {
  console.log('Time: ', new Date());
  next();
};
