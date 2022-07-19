import { Router } from 'express';
import upload from '../config/multer';
import PushController from '../controllers/PushController';

const router: Router = Router();

router.get('/test/p', PushController.pushPlan);
router.get('/list/come', PushController.getComePush);
router.get('/list/today', PushController.getTodayPush);
router.get('/list/last', PushController.getLastPush);
router.post('/:photoId', PushController.createPush);
router.get('/:pushId', PushController.getPushDetail);
export default router;
