import { Router } from 'express';
import photoRouter from '../routes/PhotoRouter';
const router: Router = Router();

router.use('/photo', photoRouter);

export default router;
