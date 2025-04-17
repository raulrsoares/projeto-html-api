import { Request, Response, NextFunction } from 'express';
import { Prisma } from '../prisma/generated/prisma';

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error('[ERRO]', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    ...(err instanceof Prisma.PrismaClientKnownRequestError && {
      code: err.code,
      meta: err.meta,
    }),
  });

  const message = err.message || 'Internal Server Error';
  const status = err.status || 500;
  res.status(status).json({ message });
};

export class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}
