import { Router } from 'express';
import {
  login,
  register,
  refreshToken,
  logout,
  verifyToken,
} from '../controllers/authController';

const router = Router();

// Authentication routes
router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;
