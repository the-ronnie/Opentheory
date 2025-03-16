import { Router } from 'express';
import stripeRouter from './stripe';
import userRouter from './users';
import consultantRouter from './consultants';
import jobSeekerRouter from './jobSeekers';
import jobRouter from './jobs';
import activityRouter from './activities';

const router = Router();

router.get('/', (req, res) => {
  res.send('API is working!');
});

router.use('/stripe', stripeRouter);
router.use('/users', userRouter);
router.use('/consultants', consultantRouter);
router.use('/job-seekers', jobSeekerRouter);
router.use('/jobs', jobRouter);
router.use('/activities', activityRouter);

export default router;
