import upload from '../config/multer';
import PhotoController from '../controllers/photo/PhotoController';
import { Router } from 'express';
const router: Router = Router();

router.post('/upload', upload.single('file'), PhotoController.uploadFileToS3);

export default router;
