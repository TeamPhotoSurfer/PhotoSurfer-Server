import { Router } from 'express';
import { check } from 'express-validator';
import upload from '../config/multer';
import PhotoController from '../controllers/PhotoController';

const router: Router = Router();

router.post('/', upload.single('file'), PhotoController.createPhotoTag);
router.get('/search', PhotoController.findPhotoByTag);
router.get('/search/:photoId', PhotoController.getPhoto);
router.post('/menu/tag', PhotoController.addPhotoTag);

router.put('/menu/tag/:tagId', PhotoController.updatePhotoTag);
router.delete('/menu/tag/:tagId', PhotoController.deletePhotoTag);

export default router;
