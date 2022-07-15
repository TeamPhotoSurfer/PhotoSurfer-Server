import { Router } from "express";
import upload from "../config/multer";
import PushController from "../controllers/PushController";

const router: Router = Router();

router.get("/:pushId", PushController.getPushDetail);

export default router;