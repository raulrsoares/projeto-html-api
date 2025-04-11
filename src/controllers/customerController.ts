import { Request, Response, NextFunction } from 'express';
import { RequestBody } from '../models/customers.model';
import { validate } from 'uuid';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from '../middlewares/errorHandler';
import prismaClient from '../prisma/prisma';

export class CustomerController {
  constructor() {
    this.create = this.create.bind(this);
    this.put = this.put.bind(this);
    this.getOne = this.getOne.bind(this);
    this.getAll = this.getAll.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, lastName, cpf, email, password, role }: RequestBody =
        req.body;
      if (!name || !lastName || !cpf || !email || !password) {
        throw new UnauthorizedError('preencha todos os campos');
      }

      const customer = await prismaClient.customer.create({
        data: {
          name,
          lastName,
          cpf,
          email,
          password,
          role,
        },
      });

      res.status(200).json({ customer });
    } catch (err) {
      next(err);
    }
  }

  async put(_req: Request, res: Response, _next: NextFunction) {
    res.json({ message: 'ok' });
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params as { user_id: string };
      if (!user_id) {
        throw new UnauthorizedError('preencha todos os parâmetros');
      }
      if (user_id === 'all' || !validate(user_id)) {
        throw new BadRequestError('ID inválido');
      }

      const findCostumer = await prismaClient.customer.findFirst({
        where: { id: user_id },
      });

      if (!findCostumer) {
        throw new NotFoundError('cliente não existe');
      }

      await prismaClient.customer.delete({
        where: { id: findCostumer.id },
      });

      res.status(200).json({ message: 'deletado com sucesso' });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params as { user_id: string };
      if (!user_id) {
        throw new UnauthorizedError('preencha todos os parâmetros');
      }
      if (user_id === 'all' || !validate(user_id)) {
        throw new BadRequestError('ID inválido');
      }

      const customer = await prismaClient.customer.findMany();

      res.status(200).json({ customer });
    } catch (err) {
      next(err);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      console.log('chegou aqui');
      const customer = await prismaClient.customer.findMany();
      console.log(customer);
      res.status(200).json(customer);
    } catch (err) {
      next(err);
    }
  }
}
