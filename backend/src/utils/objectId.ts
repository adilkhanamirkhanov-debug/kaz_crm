import mongoose from 'mongoose';
import { Response } from 'express';

export const isValidObjectId = (id: string): boolean =>
  mongoose.Types.ObjectId.isValid(id);

export const rejectInvalidId = (id: string, res: Response): boolean => {
  if (!isValidObjectId(id)) {
    res.status(400).json({ қате: 'Жарамсыз идентификатор форматы' });
    return true;
  }
  return false;
};
