
import { Router } from "express";
import PhotoRouter from "./photoRouter";
import PushRouter from "./pushRouter";
import TagRouter from "./TagRouter";
import LoginRouter from "./LoginRouter"

const router: Router = Router();

router.use("/photo", PhotoRouter);
router.use("/push", PushRouter);
router.use("/tag", TagRouter);
router.use("/auth", LoginRouter);

export default router;
