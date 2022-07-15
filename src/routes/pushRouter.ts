import { Router } from "express";
import upload from "../config/multer";
import PushController from "../controllers/PushController";

const router: Router = Router();

router.post("/:photoId", PushController.createPush);

export default router;