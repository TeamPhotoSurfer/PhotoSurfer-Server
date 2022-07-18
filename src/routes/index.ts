import { Router } from "express";
import PhotoRouter from "./photoRouter";
import TagRouter from "./TagRouter";
const router: Router = Router();

router.use("/photo", PhotoRouter);
router.use("/tag", TagRouter);

export default router;
