import { Response } from 'express';
import Activity from '../models/Activity';
import { AuthRequest } from '../middleware/auth';
import { rejectInvalidId } from '../utils/objectId';

export const getAllActivities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query['беттің_нөмірі'] as string) || 1;
    const limit = parseInt(req.query['бет_өлшемі'] as string) || 10;
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};
    if (req.query['статус']) filter['статус'] = String(req.query['статус']);
    if (req.query['түрі']) filter['түрі'] = String(req.query['түрі']);
    if (req.query['клиент']) {
      const clientId = String(req.query['клиент']);
      if (rejectInvalidId(clientId, res)) return;
      filter['клиент'] = clientId;
    }
    const total = await Activity.countDocuments(filter);
    const activities = await Activity.find(filter)
      .populate('клиент', 'аты')
      .populate('менеджер', 'аты эл_пошта')
      .skip(skip)
      .limit(limit);
    res.json({ іс_шаралар: activities, жалпы: total, бет: page, беттер_саны: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const getActivityById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (rejectInvalidId(req.params.id, res)) return;
    const activity = await Activity.findById(req.params.id)
      .populate('клиент', 'аты')
      .populate('менеджер', 'аты эл_пошта');
    if (!activity) {
      res.status(404).json({ қате: 'Іс-шара табылмады' });
      return;
    }
    res.json({ іс_шара: activity });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const createActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json({ хабарлама: 'Іс-шара сәтті қосылды', іс_шара: activity });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const updateActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (rejectInvalidId(req.params.id, res)) return;
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!activity) {
      res.status(404).json({ қате: 'Іс-шара табылмады' });
      return;
    }
    res.json({ хабарлама: 'Іс-шара жаңартылды', іс_шара: activity });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const deleteActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (rejectInvalidId(req.params.id, res)) return;
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      res.status(404).json({ қате: 'Іс-шара табылмады' });
      return;
    }
    res.json({ хабарлама: 'Іс-шара жойылды' });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};
