import { Router } from 'express';
import { check } from 'express-validator';
import upload from '../config/multer';
import PhotoController from '../controllers/PhotoController';

const router: Router = Router();

router.post('/', upload.single('file'), PhotoController.createPhotoTag);
router.get('/', PhotoController.findPhotoByTag);

router.post('/tag', PhotoController.addPhotoTag);
router.get('/:photoId', PhotoController.getPhoto);
router.put('/tag/:tagId', PhotoController.updatePhotoTag);
router.delete('/tag/:tagId', PhotoController.deletePhotoTag);

export default router;
