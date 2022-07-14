import { Router } from 'express';
import { check } from 'express-validator';
import { PushController } from '../controllers';
import upload from '../config/multer';
import PhotoController from '../controllers/photo/PhotoController';

const router: Router = Router();

router.post('/push', PushController.createPush);

router.post('/', upload.single('file'), PhotoController.createPhotoTag);


export default router;
