import { Response } from 'express';
import Client from '../models/Client';
import { AuthRequest } from '../middleware/auth';
import { rejectInvalidId } from '../utils/objectId';

const escapeRegex = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getAllClients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query['беттің_нөмірі'] as string) || 1;
    const limit = parseInt(req.query['бет_өлшемі'] as string) || 10;
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};
    if (req.query['іздеу']) {
      const search = escapeRegex(String(req.query['іздеу']));
      filter['$or'] = [
        { аты: { $regex: search, $options: 'i' } },
        { эл_пошта: { $regex: search, $options: 'i' } },
        { компания: { $regex: search, $options: 'i' } },
      ];
    }
    if (req.query['статус']) {
      filter['статус'] = String(req.query['статус']);
    }
    const total = await Client.countDocuments(filter);
    const clients = await Client.find(filter)
      .populate('жауапты_менеджер', 'аты эл_пошта')
      .skip(skip)
      .limit(limit);
    res.json({ клиенттер: clients, жалпы: total, бет: page, беттер_саны: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const getClientById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (rejectInvalidId(req.params.id, res)) return;
    const client = await Client.findById(req.params.id).populate('жауапты_менеджер', 'аты эл_пошта');
    if (!client) {
      res.status(404).json({ қате: 'Клиент табылмады' });
      return;
    }
    res.json({ клиент: client });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const createClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json({ хабарлама: 'Клиент сәтті қосылды', клиент: client });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const updateClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (rejectInvalidId(req.params.id, res)) return;
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) {
      res.status(404).json({ қате: 'Клиент табылмады' });
      return;
    }
    res.json({ хабарлама: 'Клиент жаңартылды', клиент: client });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (rejectInvalidId(req.params.id, res)) return;
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      res.status(404).json({ қате: 'Клиент табылмады' });
      return;
    }
    res.json({ хабарлама: 'Клиент жойылды' });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};
