import { Router } from 'express';
import stripeRouter from './stripe';

const router = Router();

router.get('/', (req, res) => {
  res.send('API is working!');
});

router.use('/stripe', stripeRouter);

export default router;
