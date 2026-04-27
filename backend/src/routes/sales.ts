import { Router } from 'express';
import { getAllSales, getSaleById, createSale, updateSale, deleteSale, getSalesByStage } from '../controllers/saleController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, saleSchema } from '../middleware/validation';

const router = Router();

router.get('/pipeline', authenticateToken, getSalesByStage);
router.get('/', authenticateToken, getAllSales);
router.get('/:id', authenticateToken, getSaleById);
router.post('/', authenticateToken, validateRequest(saleSchema), createSale);
router.put('/:id', authenticateToken, updateSale);
router.delete('/:id', authenticateToken, deleteSale);

export default router;
