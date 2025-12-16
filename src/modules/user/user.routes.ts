import { Router } from 'express';
import { AuthController, UserController } from './user.controller';
import { authenticateToken } from '../../middleware/auth';

const router = Router();
const authController = new AuthController();
const userController = new UserController();

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);

// User routes
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.get('/users/username/:username', userController.getUserByUsername);

export default router;