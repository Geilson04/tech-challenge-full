import { Router } from 'express';
import * as postController from '../controllers/postController';

const router = Router();

router.get('/posts', postController.getPosts);
router.get('/posts/search', postController.searchPosts);
router.get('/posts/:id', postController.getPost);
router.post('/posts', postController.createPost);
router.put('/posts/:id', postController.updatePost);
router.delete('/posts/:id', postController.deletePost);

export default router;
