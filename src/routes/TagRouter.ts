import { Router } from "express";
import TagController from "../controllers/TagController";
// import auth from '../modules/auth';

const router: Router = Router();

router.put("/bookmark/:tagId", TagController.addBookmark);
router.delete("/bookmark/:tagId", TagController.deleteBookmark);
router.get("/", TagController.getTagNames);
router.put("/:tagId", TagController.updateTag);
router.delete("/:tagId", TagController.deleteTag);
router.get("/main", TagController.getMainTags);
router.get("/search", TagController.getOftenSearchTags);
export default router;
