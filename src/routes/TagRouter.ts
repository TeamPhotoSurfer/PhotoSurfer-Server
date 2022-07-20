import { Router } from 'express';
import TagController from '../controllers/TagController';
import auth from '../middleware/auth';
// import auth from '../modules/auth';

const router: Router = Router();

router.put('/bookmark/:tagId', auth, TagController.addBookmark);
router.delete('/bookmark/:tagId', auth, TagController.deleteBookmark);
router.get('/', auth, TagController.getTagNames);
router.put('/:tagId', auth, TagController.updateTag);
router.delete('/:tagId', auth, TagController.deleteTag);
router.get('/main', auth, TagController.getMainTags);
router.get('/search', auth, TagController.getOftenSearchTags);
export default router;