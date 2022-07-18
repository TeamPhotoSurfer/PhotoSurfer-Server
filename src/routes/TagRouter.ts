import { Router } from "express";
import { TagController } from "../controllers";
// import auth from '../modules/auth';

const router: Router = Router();

router.put("/bookmark/:tagId", TagController.addBookmark);
router.delete("/bookmark/:tagId", TagController.deleteBookmark);
export default router;
