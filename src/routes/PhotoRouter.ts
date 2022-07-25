import { Router } from 'express';
import { check } from 'express-validator';
import upload from '../config/multer';
import PhotoController from '../controllers/PhotoController';
import auth from '../middleware/auth';

const router: Router = Router();

router.post('/', upload.single('file'), auth, PhotoController.createPhotoTag);
router.put("/", auth, PhotoController.deletePhoto);
router.get('/search', auth, PhotoController.findPhotoByTag);
router.post('/menu/tag', auth, PhotoController.addPhotoTag);
router.get('/tag', auth, PhotoController.getTag);
router.put('/menu/tag/:tagId', auth, PhotoController.updatePhotoTag);
router.delete('/menu/tag/:tagId', auth, PhotoController.deletePhotoTag);
router.get('/detail/:photoId', auth, PhotoController.getPhoto);
export default router;
