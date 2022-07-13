import { Router } from "express";
import { TagController } from "../controllers";

const router: Router = Router();
router.get("/", TagController.getTagName);

export default router;
