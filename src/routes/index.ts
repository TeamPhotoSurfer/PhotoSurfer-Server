//router index file
import { Router } from 'express';
import { PushController } from '../controllers';
import PhotoRouter from './PhotoRouter';
const router: Router = Router();

router.post('/photo/push', PushController.createPush);
router.use('/photo', PhotoRouter);

router.post('/test', PushController.test);
export default router;
