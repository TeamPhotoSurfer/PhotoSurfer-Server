//router index file
import { Router } from "express";
import { PushController } from "../controllers";
import loginRouter from "./loginRouter";

const router: Router = Router();

router.post("/photo/push", PushController.createPush);
router.use("/auth", loginRouter);

export default router;
