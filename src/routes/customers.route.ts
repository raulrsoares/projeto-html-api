import { Router } from 'express';
import { CustomerController } from '../controllers/customerController';
import { jwtAuth } from '../middlewares/authMiddleware';

export const router = Router();

const controller = new CustomerController();

router.post('/create', controller.create);
router.put('/update', jwtAuth, controller.put);
router.delete('/delete/:user_id', jwtAuth, controller.delete);
router.get('/read/all', controller.getAll);
router.get('/read/:user_id', controller.getOne);
