import { Router } from "express";
import { check } from "express-validator";
import { photoController } from "../controllers";
import upload from "../config/multer";
import PhotoController from "../controllers/PhotoController";

const router: Router = Router();

// router.post('/', upload.single('file'), PhotoController.test);
router.post("/", PhotoController.test);
router.put("/", PhotoController.putPhoto);
export default router;
