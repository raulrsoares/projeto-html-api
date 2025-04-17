import { Request, Response, NextFunction } from 'express';
import { Prisma } from '../prisma/generated/prisma';
import { RequestBody, PutRequestBody } from '../models/customers.model';
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
      const {
        name,
        lastName,
        cep,
        endereco,
        bairro,
        estado,
        numero,
        email,
        password,
        role,
      }: RequestBody = req.body;

      if (
        !name ||
        !lastName ||
        !cep ||
        !endereco ||
        !bairro ||
        !estado ||
        !numero ||
        !email ||
        !password
      ) {
        throw new UnauthorizedError('preencha todos os campos');
      }

      const customer = await prismaClient.customer.create({
        data: {
          name,
          lastName,
          cep,
          endereco,
          bairro,
          estado,
          numero,
          email,
          password,
          role,
        },
        select: {
          id: true,
          name: true,
          lastName: true,
          isActive: true,
          cep: true,
          endereco: true,
          bairro: true,
          estado: true,
          numero: true,
          email: true,
          password: false,
          updated_at: true,
          created_at: true,
        },
      });

      res.status(200).json({ customer });
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

  async put(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params as { user_id: string };
      const { sub, role } = (req as any).userInfo;
      const {
        name,
        lastName,
        cep,
        endereco,
        bairro,
        estado,
        numero,
        email,
        password,
        isActive,
      }: PutRequestBody = req.body;

      if (
        !name ||
        !lastName ||
        !cep ||
        !endereco ||
        !bairro ||
        !estado ||
        !numero ||
        !email ||
        !password
      ) {
        throw new UnauthorizedError('preencha todos os campos');
      }

      if (!user_id) {
        throw new UnauthorizedError('preencha todos os campos');
      }

      const findCostumer = await prismaClient.customer.findFirst({
        where: { id: user_id },
      });

      if (!findCostumer) {
        throw new NotFoundError('cliente não existe');
      }

      const isTryingToDeleteSelf = user_id === sub;
      const isAdmin = role === 'admin';

      if (
        (!isAdmin && !isTryingToDeleteSelf) ||
        (isAdmin && isTryingToDeleteSelf)
      ) {
        throw new UnauthorizedError(
          'Você não tem permissão para alterar esse usuário',
        );
      }

      await prismaClient.customer.update({
        data: {
          name,
          lastName,
          isActive: isActive || true,
          cep,
          endereco,
          bairro,
          estado,
          numero,
          email,
          password,
          updated_at: new Date(),
        },
        where: { id: findCostumer.id },
      });

      res.status(200).json({ message: 'atualizado com sucesso' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params as { user_id: string };
      const { sub, role } = (req as any).userInfo;
      if (!user_id) {
        throw new UnauthorizedError('preencha todos os parâmetros');
      }

      if (user_id === 'all') {
        throw new BadRequestError('ID inválido');
      }

      const findCostumer = await prismaClient.customer.findFirst({
        where: { id: user_id },
      });

      if (!findCostumer) {
        throw new NotFoundError('cliente não existe');
      }

      const isTryingToDeleteSelf = user_id === sub;
      const isAdmin = role === 'admin';

      if (
        (!isAdmin && !isTryingToDeleteSelf) ||
        (isAdmin && isTryingToDeleteSelf)
      ) {
        throw new UnauthorizedError(
          'Você não tem permissão para deletar esse usuário',
        );
      }

      await prismaClient.customer.delete({
        where: { id: findCostumer.id },
      });

      res.status(200).json({ message: 'deletado com sucesso' });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params as { user_id: string };
      if (!user_id) {
        throw new UnauthorizedError('preencha todos os parâmetros');
      }
      if (user_id === 'all') {
        throw new BadRequestError('ID inválido');
      }

      const customer = await prismaClient.customer.findMany({
        where: { id: user_id },
        select: {
          name: true,
          lastName: true,
          isActive: true,
          cep: true,
          endereco: true,
          bairro: true,
          estado: true,
          numero: true,
          email: true,
          password: false,
          updated_at: true,
          created_at: true,
        },
      });

      res.status(200).json({ customer: customer[0] });
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await prismaClient.customer.findMany({
        select: {
          id: true,
          name: true,
          lastName: true,
          isActive: true,
          cep: true,
          endereco: true,
          bairro: true,
          estado: true,
          numero: true,
          email: true,
          password: false,
          updated_at: true,
          created_at: true,
        },
      });
      console.log(customer);
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  }
}
