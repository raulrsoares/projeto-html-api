import { Router } from 'express';
import { JwtServices } from '../controllers/jwt';

export const router = Router();

router.post('/', new JwtServices().generateSecretToken);
