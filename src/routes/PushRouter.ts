import { Router } from "express";
import { PushController } from "../controllers";

const router: Router = Router();

router.get("/come", PushController.getComePush);
router.get("/today", PushController.getTodayPush);
router.get("/last", PushController.getLastPush);

export default router;
