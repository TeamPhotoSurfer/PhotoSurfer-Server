import { Router } from 'express';
import PhotoRouter from './photoRouter';
import PushRouter from './PushRouter';
import TagRouter from './TagRouter';

const router: Router = Router();

router.use('/photo', PhotoRouter);
router.use('/push', PushRouter);
router.use('/tag', TagRouter);

export default router;
