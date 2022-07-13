//router index file
import { Router } from "express";
import { PushController } from "../controllers";
import { TagController } from "../controllers";

const router: Router = Router();

router.post('/photo/push', PushController.createPush);
router.get('/test', PushController.test);
router.use('/photo', PhotoRouter);
router.use("/tag", TagController.getTagName);

export default router;
