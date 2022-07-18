import { Router } from 'express';
import { check } from 'express-validator';
import upload from '../config/multer';
import PhotoController from '../controllers/PhotoController';
// import auth from '../modules/auth';

const router: Router = Router();

router.post('/', upload.single('file'), PhotoController.createPhotoTag);
router.get('/:photoId', PhotoController.getPhoto);

router.delete('/tag/:tagId', PhotoController.deletePhotoTag);
router.post('/tag', PhotoController.addPhotoTag);
router.get('/tag', PhotoController.findPhotoByTag);

export default router;
