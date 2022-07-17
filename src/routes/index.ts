import { Router } from 'express';
import PhotoRouter from './photoRouter';
const router: Router = Router();

router.use('/photo', PhotoRouter);

export default router;
