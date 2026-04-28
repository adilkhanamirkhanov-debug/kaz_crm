import { Router } from 'express';
import { getAllActivities, getActivityById, createActivity, updateActivity, deleteActivity } from '../controllers/activityController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, activitySchema } from '../middleware/validation';

const router = Router();

router.get('/', authenticateToken, getAllActivities);
router.get('/:id', authenticateToken, getActivityById);
router.post('/', authenticateToken, validateRequest(activitySchema), createActivity);
router.put('/:id', authenticateToken, validateRequest(activitySchema.partial()), updateActivity);
router.delete('/:id', authenticateToken, deleteActivity);

export default router;
