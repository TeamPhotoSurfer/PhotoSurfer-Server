import { Router } from "express";
import { TagController } from "../controllers";
// import auth from '../modules/auth';

const router: Router = Router();

router.put("/bookmark/:tagId", TagController.bookmarkAdd)
router.delete("/bookmark/:tagId", TagController.bookmarkDelete)
export default router;