import mongoose from 'mongoose';
import { Response } from 'express';

export const parseObjectId = (
  id: string,
  res: Response
): mongoose.Types.ObjectId | null => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ қате: 'Жарамсыз идентификатор форматы' });
    return null;
  }
  return new mongoose.Types.ObjectId(id);
};
