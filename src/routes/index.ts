//router index file
import { Router } from 'express';
import { PushController } from '../controllers';

const router: Router = Router();

router.post('/photo/push', PushController.createPush);

router.post('/test', PushController.test);
export default router;
