import { Router } from 'express';
import { JwtServices } from '../services/jwt';

export const router = Router();

router.post('/', new JwtServices().generateSecretToken);
