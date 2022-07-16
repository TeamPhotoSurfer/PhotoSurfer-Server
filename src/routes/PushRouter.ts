import { Router } from "express";
import { PushController } from "../controllers";

const router: Router = Router();

router.get("/today", PushController.getTodayPush);
export default router;