import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { rejectInvalidId } from '../utils/objectId';

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query['беттің_нөмірі'] as string) || 1;
    const limit = parseInt(req.query['бет_өлшемі'] as string) || 10;
    const skip = (page - 1) * limit;
    const total = await User.countDocuments();
    const users = await User.find().select('-құпия_сөз').skip(skip).limit(limit);
    res.json({ пайдаланушылар: users, жалпы: total, бет: page, беттер_саны: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (rejectInvalidId(req.params.id, res)) return;
    const user = await User.findById(req.params.id).select('-құпия_сөз');
    if (!user) {
      res.status(404).json({ қате: 'Пайдаланушы табылмады' });
      return;
    }
    res.json({ пайдаланушы: user });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (rejectInvalidId(req.params.id, res)) return;
    const { аты, эл_пошта, рөлі, белсенді } = req.body as { аты: string; эл_пошта: string; рөлі: string; белсенді: boolean };
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { аты: String(аты).trim(), эл_пошта: String(эл_пошта).toLowerCase().trim(), рөлі, белсенді },
      { new: true, select: '-құпия_сөз' }
    );
    if (!user) {
      res.status(404).json({ қате: 'Пайдаланушы табылмады' });
      return;
    }
    res.json({ хабарлама: 'Пайдаланушы жаңартылды', пайдаланушы: user });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (rejectInvalidId(req.params.id, res)) return;
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ қате: 'Пайдаланушы табылмады' });
      return;
    }
    res.json({ хабарлама: 'Пайдаланушы жойылды' });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};
