import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ қате: 'Токен табылмады' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id).select('-құпия_сөз');
    if (!user) {
      res.status(401).json({ қате: 'Пайдаланушы табылмады' });
      return;
    }
    if (!user.белсенді) {
      res.status(401).json({ қате: 'Пайдаланушы блокталған' });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(403).json({ қате: 'Жарамсыз немесе мөрзі өткен токен' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ қате: 'Тіркеліктен өтпеңіз' });
      return;
    }
    if (!roles.includes(req.user.рөлі)) {
      res.status(403).json({ қате: 'Бұл әрекетке қатынасуға рұқсатыңыз жоқ' });
      return;
    }
    next();
  };
};
