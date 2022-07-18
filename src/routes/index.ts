import { Router } from "express";
import PhotoRouter from "./photoRouter";
import TagRouter from "./TagRouter";
import PushRouter from "./PushRouter";

const router: Router = Router();

router.use("/photo", PhotoRouter);
router.use("/push", PushRouter);
router.use("/tag", TagRouter);

export default router;
