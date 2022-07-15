import { Router } from "express";
import upload from "../config/multer";
import TagController from "../controllers/TagController";

const router: Router = Router();

router.get('/', TagController.getTagNames);
router.put('/:tagId', TagController.updateTagName);

export default router;