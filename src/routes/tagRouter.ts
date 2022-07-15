import { Router } from "express";
import upload from "../config/multer";
import TagController from "../controllers/TagController";

const router: Router = Router();

router.get('/', TagController.getTagNames);

export default router;