import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/users', userController.getUsers);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

export default router;
