import { Router } from 'express';
import { getAllClients, getClientById, createClient, updateClient, deleteClient } from '../controllers/clientController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { validateRequest, clientSchema } from '../middleware/validation';

const router = Router();

router.get('/', authenticateToken, getAllClients);
router.get('/:id', authenticateToken, getClientById);
router.post('/', authenticateToken, authorizeRoles('admin', 'manager'), validateRequest(clientSchema), createClient);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'manager'), validateRequest(clientSchema.partial()), updateClient);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'manager'), deleteClient);

export default router;
