import { Router } from 'express';
import enrichWebsite from '../controller/enrichController';

const router = Router();

router.post('/', enrichWebsite);

export default router;
