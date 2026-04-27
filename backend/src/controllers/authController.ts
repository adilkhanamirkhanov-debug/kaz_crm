import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { аты, эл_пошта, құпия_сөз } = req.body as { аты: string; эл_пошта: string; құпия_сөз: string };
    const existing = await User.findOne({ эл_пошта });
    if (existing) {
      res.status(400).json({ қате: 'Бұл эл. пошта адресі бұрыннан тіркелген' });
      return;
    }
    const user = await User.create({ аты, эл_пошта, құпия_сөз });
    const token = generateToken(user._id.toString());
    res.status(201).json({
      хабарлама: 'Пайдаланушы сәтті тіркелді',
      токен: token,
      пайдаланушы: { id: user._id, аты: user.аты, эл_пошта: user.эл_пошта, рөлі: user.рөлі },
    });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { эл_пошта, құпия_сөз } = req.body as { эл_пошта: string; құпия_сөз: string };
    const user = await User.findOne({ эл_пошта });
    if (!user) {
      res.status(401).json({ қате: 'Эл. пошта немесе құпия сөз қате' });
      return;
    }
    if (!user.белсенді) {
      res.status(401).json({ қате: 'Пайдаланушы блокталған' });
      return;
    }
    const isMatch = await user.comparePassword(құпия_сөз);
    if (!isMatch) {
      res.status(401).json({ қате: 'Эл. пошта немесе құпия сөз қате' });
      return;
    }
    const token = generateToken(user._id.toString());
    res.json({
      хабарлама: 'Жүйеге сәтті кірдіңіз',
      токен: token,
      пайдаланушы: { id: user._id, аты: user.аты, эл_пошта: user.эл_пошта, рөлі: user.рөлі },
    });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ қате: 'Тіркеліктен өтпеңіз' });
      return;
    }
    res.json({ пайдаланушы: req.user });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ қате: 'Тіркеліктен өтпеңіз' });
      return;
    }
    const { аты, эл_пошта } = req.body as { аты: string; эл_пошта: string };
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { аты, эл_пошта },
      { new: true, select: '-құпия_сөз' }
    );
    res.json({ хабарлама: 'Профиль жаңартылды', пайдаланушы: updated });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};
