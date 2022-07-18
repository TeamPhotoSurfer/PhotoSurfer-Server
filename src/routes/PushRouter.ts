import { Router } from "express";
import { PushController } from "../controllers";

const router: Router = Router();


router.get("/come", PushController.getComePush);
export default router;
