import { Router } from 'express';
import PhotoRouter from './photoRouter';
import PushRouter from './PushRouter';
const router: Router = Router();

router.use('/photo', PhotoRouter);
router.use('/push', PushRouter);

export default router;
