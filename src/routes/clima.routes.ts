import { Router } from 'express';
import { jwtAuth } from '../middlewares/authMiddleware';
import { ClimaController } from '../controllers/climaController';

export const router = Router();

const controller = new ClimaController();

router.get('/:user_id', jwtAuth, controller.getCustomerClima);
