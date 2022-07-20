import { Router } from 'express';
import upload from '../config/multer';
import PushController from '../controllers/PushController';
import auth from '../middleware/auth';

const router: Router = Router();

router.get('/test/p', PushController.pushPlan);
router.get('/list/come', auth, PushController.getComePush);
router.get('/list/today', auth, PushController.getTodayPush);
router.get('/list/last', auth, PushController.getLastPush);
router.post('/:photoId', auth, PushController.createPush);
router.get('/:pushId', auth, PushController.getPushDetail);
export default router;