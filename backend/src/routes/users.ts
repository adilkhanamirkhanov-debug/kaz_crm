import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, authorizeRoles('admin'), getAllUsers);
router.get('/:id', authenticateToken, authorizeRoles('admin'), getUserById);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateUser);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteUser);

export default router;
