import { Router } from 'express';
import { router as authRoutes } from './auth.routes';
import { router as customersRoutes } from './customers.route';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/customers', customersRoutes);
