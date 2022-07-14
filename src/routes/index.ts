import { Router } from 'express';
import { PushController } from '../controllers';
import PhotoRouter from './photoRouter';

const router = Router();

router.post('/test', PushController.test);

router.use('/photo', PhotoRouter);

export default router;
