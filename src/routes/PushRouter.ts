import { Router } from 'express';
import upload from '../config/multer';
import PushController from '../controllers/PushController';

const router: Router = Router();

router.post('/:photoId', PushController.createPush);
router.get('/:pushId', PushController.getPushDetail);
router.get('/test/p', PushController.pushPlan);
router.get('/come', PushController.getComePush);
router.get('/today', PushController.getTodayPush);
router.get('/last', PushController.getLastPush);

export default router;
