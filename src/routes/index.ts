import { Router } from 'express';
import photoRouter from '../routes/PhotoRouter';
import pushRouter from '../routes/pushRouter';

const router: Router = Router();

router.use('/photo', photoRouter);
router.use('/push', pushRouter);

export default router;
