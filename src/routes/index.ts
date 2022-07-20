import { Router } from 'express';

import PushRouter from './PushRouter';
import TagRouter from './TagRouter';
import AuthRouter from './AuthRouter';
import PhotoRouter from './PhotoRouter';

const router: Router = Router();

router.use('/photo', PhotoRouter);
router.use('/push', PushRouter);
router.use('/tag', TagRouter);
router.use('/auth', AuthRouter);

export default router;
