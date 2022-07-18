
import { Router } from "express";
import PhotoRouter from "./photoRouter";
import PushRouter from "./pushRouter";
import TagRouter from "./tagRouter";

const router: Router = Router();

router.use("/photo", PhotoRouter);
router.use("/push", PushRouter);
router.use("/tag", TagRouter);

export default router;
