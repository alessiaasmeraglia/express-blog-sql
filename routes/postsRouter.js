import express from 'express';
import postsController from '../controllers/postsController.js';

const router = express.Router();

router.get('/', postsController.index);
router.get('/:id', postsController.show);
router.post('/', postsController.store);
router.delete('/:id', postsController.destroy);

export default router;