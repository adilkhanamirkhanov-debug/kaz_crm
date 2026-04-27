import { Response } from 'express';
import Sale from '../models/Sale';
import { AuthRequest } from '../middleware/auth';
import { rejectInvalidId } from '../utils/objectId';

export const getAllSales = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query['беттің_нөмірі'] as string) || 1;
    const limit = parseInt(req.query['бет_өлшемі'] as string) || 10;
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};
    if (req.query['статус']) filter['статус'] = String(req.query['статус']);
    const total = await Sale.countDocuments(filter);
    const sales = await Sale.find(filter)
      .populate('клиент', 'аты')
      .populate('менеджер', 'аты эл_пошта')
      .skip(skip)
      .limit(limit);
    res.json({ сатулар: sales, жалпы: total, бет: page, беттер_саны: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const getSaleById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (rejectInvalidId(req.params.id, res)) return;
    const sale = await Sale.findById(req.params.id)
      .populate('клиент', 'аты')
      .populate('менеджер', 'аты эл_пошта');
    if (!sale) {
      res.status(404).json({ қате: 'Сату табылмады' });
      return;
    }
    res.json({ сату: sale });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const createSale = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sale = await Sale.create(req.body);
    res.status(201).json({ хабарлама: 'Сату сәтті қосылды', сату: sale });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const updateSale = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (rejectInvalidId(req.params.id, res)) return;
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sale) {
      res.status(404).json({ қате: 'Сату табылмады' });
      return;
    }
    res.json({ хабарлама: 'Сату жаңартылды', сату: sale });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const deleteSale = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (rejectInvalidId(req.params.id, res)) return;
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
      res.status(404).json({ қате: 'Сату табылмады' });
      return;
    }
    res.json({ хабарлама: 'Сату жойылды' });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const getSalesByStage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pipeline = await Sale.aggregate([
      {
        $group: {
          _id: '$сатыс',
          саны: { $sum: 1 },
          жалпы_сома: { $sum: '$сомасы' },
        },
      },
      { $sort: { саны: -1 } },
    ]);
    res.json({ сатыс_бойынша: pipeline });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};
