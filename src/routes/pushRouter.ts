import { Router } from "express";
import upload from "../config/multer";
import PushController from "../controllers/PushController";

const router: Router = Router();

router.get("/:pushId", PushController.getPushDetail);
router.get("/test/p",PushController.pushPlan);

export default router;