import { PrismaClient } from './generated/prisma';

const prismaClient = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

export default prismaClient;
