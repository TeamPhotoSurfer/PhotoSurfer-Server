import upload from '../config/multer';
import PhotoController from '../controllers/photo/PhotoController';
import { Router } from 'express';
const router: Router = Router();

router.post('/', upload.single('file'), PhotoController.createPhotoTag);

export default router;
