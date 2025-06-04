import { Router } from 'express';
import { router as authRoutes } from './auth.routes';
import { router as customersRoutes } from './customers.route';
import { router as climaRoutes } from './clima.routes';
import { router as bookRoutes } from './book.route';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/customers', customersRoutes);
router.use('/books', bookRoutes);
router.use('/temperatura', climaRoutes);
