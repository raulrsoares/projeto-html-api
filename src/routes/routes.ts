import { Router } from 'express';
// import itemRoutes from './itemRoutes';
import { router as authRoutes } from './auth.routes';
import { jwtAuth } from '../middlewares/authMiddleware';

const router = Router();

// router.use('/items', jwtAuth);
router.use('/auth', authRoutes);

export default router;
