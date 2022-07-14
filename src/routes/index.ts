import { Router } from "express";
import { PushController } from "../controllers";
import { TagController } from "../controllers";
import PhotoRouter from "./photoRouter";

const router: Router = Router();

router.get('/test', PushController.test);
router.use('/photo', PhotoRouter);
router.use("/tag", TagController.getTagName);

export default router;