import { Router } from "express";
import PhotoController from "../controllers/PhotoController";

const router: Router = Router();

// router.post('/', upload.single('file'), PhotoController.test);
router.post("/", PhotoController.test);
router.put("/", PhotoController.deletePhoto);
export default router;
