import { Router } from 'express';
import { check } from 'express-validator';
import upload from '../config/multer';
import PhotoController from '../controllers/PhotoController';
// import auth from '../modules/auth';

const router: Router = Router();

router.post('/', upload.single('file'), PhotoController.createPhotoTag);

router.delete('/tag/:tagId', PhotoController.deletePhotoTag);
export default router;
