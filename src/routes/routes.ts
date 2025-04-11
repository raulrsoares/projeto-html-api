import { Router } from 'express';
import { router as authRoutes } from './auth.routes';
import { router as customersRoutes } from './customers.route';
// import { jwtAuth } from '../middlewares/authMiddleware';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/customers', customersRoutes);
