import { Router } from 'express';
import PhotoRouter from './PhotoRouter';
const router: Router = Router();

router.use('/photo', PhotoRouter);

export default router;
