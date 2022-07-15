import { Router } from "express";
import PushController from "../controllers/PushController";

const router: Router = Router();

router.get("/last", PushController.getLastPush);

export default router;
