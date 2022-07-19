import { Router } from 'express';
import { check } from 'express-validator';
import { photoController } from '../controllers';
import upload from '../config/multer';
import PhotoController from '../controllers/PhotoController';
// import auth from '../modules/auth';

const router: Router = Router();

router.post('/', upload.single('file'), PhotoController.createPhotoTag);

router.post('/tag', PhotoController.addPhotoTag);
router.get('/tag', PhotoController.findPhotoByTag);
router.get('/:photoId', PhotoController.getPhoto);
router.put('/tag/:tagId', PhotoController.updatePhotoTag);
router.delete('/tag/:tagId', PhotoController.deletePhotoTag);
export default router;
