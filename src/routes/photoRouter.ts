import { Router } from 'express';
import { check } from 'express-validator';
import { PushController } from '../controllers';

const router: Router = Router();

router.post('/push', PushController.createPush);
export default router;
