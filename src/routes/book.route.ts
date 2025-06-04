import { Router } from 'express';
import { jwtAuth } from '../middlewares/authMiddleware';
import { BookController } from '../controllers/bookController';

export const router = Router();

const controller = new BookController();

router.post('/create', controller.create);
router.put('/update/:book_id', jwtAuth, controller.update);
router.delete('/delete/:book_id', jwtAuth, controller.delete);
router.get('/read/all', controller.getAll);
router.get('/read/:book_id', controller.getOne);
