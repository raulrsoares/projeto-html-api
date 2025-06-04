import { Request, Response, NextFunction } from 'express';
import { Prisma } from '../prisma/generated/prisma';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from '../middlewares/errorHandler';
import prismaClient from '../prisma/prisma';

export class BookController {
  constructor() {
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.getOne = this.getOne.bind(this);
    this.getAll = this.getAll.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { titulo, autor, genero, disponibilidade, capa } = req.body;

      if (!titulo || !autor || !genero || !disponibilidade || !capa) {
        throw new UnauthorizedError('Preencha todos os campos obrigatórios');
      }

      const book = await prismaClient.books.create({
        data: {
          titulo,
          autor,
          genero,
          disponibilidade,
          capa,
        },
        select: {
          id: true,
          titulo: true,
          autor: true,
          genero: true,
          disponibilidade: true,
          capa: true,
          isActive: true,
          return_date: true,
          created_at: true,
          updated_at: true,
        },
      });

      res.status(200).json({ book });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return next(
            new UnauthorizedError(
              `O campo ${error.meta?.target} já está em uso.`,
            ),
          );
        }
      }
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { book_id } = req.params;
      const { titulo, autor, genero, disponibilidade, capa, isActive } =
        req.body;

      if (!book_id) {
        throw new UnauthorizedError('ID do livro não informado');
      }

      const findBook = await prismaClient.books.findFirst({
        where: { id: book_id },
      });

      if (!findBook) {
        throw new NotFoundError('Livro não encontrado');
      }

      await prismaClient.books.update({
        where: { id: book_id },
        data: {
          titulo,
          autor,
          genero,
          disponibilidade,
          capa,
          isActive,
          updated_at: new Date(),
        },
      });

      res.status(200).json({ message: 'Livro atualizado com sucesso' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { book_id } = req.params;

      if (!book_id) {
        throw new UnauthorizedError('ID do livro não informado');
      }

      const findBook = await prismaClient.books.findFirst({
        where: { id: book_id },
      });

      if (!findBook) {
        throw new NotFoundError('Livro não encontrado');
      }

      await prismaClient.books.delete({
        where: { id: book_id },
      });

      res.status(200).json({ message: 'Livro deletado com sucesso' });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { book_id } = req.params;

      if (!book_id) {
        throw new UnauthorizedError('ID do livro não informado');
      }

      const book = await prismaClient.books.findFirst({
        where: { id: book_id },
        select: {
          id: true,
          titulo: true,
          autor: true,
          genero: true,
          disponibilidade: true,
          capa: true,
          isActive: true,
          return_date: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!book) {
        throw new NotFoundError('Livro não encontrado');
      }

      res.status(200).json({ book });
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const books = await prismaClient.books.findMany({
        select: {
          id: true,
          titulo: true,
          autor: true,
          genero: true,
          disponibilidade: true,
          capa: true,
          isActive: true,
          return_date: true,
          created_at: true,
          updated_at: true,
        },
      });

      res.status(200).json(books);
    } catch (error) {
      next(error);
    }
  }
}
