import { Router } from 'express';
import photoRouter from '../routes/photoRouter';
import pushRouter from '../routes/pushRouter';
import tagRouter from '../routes/tagRouter';

const router: Router = Router();

router.use('/photo', photoRouter);
router.use('/push', pushRouter);
router.use('/tag', tagRouter);

export default router;
