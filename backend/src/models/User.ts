import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  аты: string;
  эл_пошта: string;
  құпия_сөз: string;
  рөлі: 'admin' | 'manager' | 'user';
  белсенді: boolean;
  жасалған_уақыт: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  аты: { type: String, required: true, trim: true },
  эл_пошта: { type: String, required: true, unique: true, lowercase: true, trim: true },
  құпия_сөз: { type: String, required: true, minlength: 6 },
  рөлі: { type: String, enum: ['admin', 'manager', 'user'], default: 'user' },
  белсенді: { type: Boolean, default: true },
  жасалған_уақыт: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('құпия_сөз')) return next();
  const salt = await bcrypt.genSalt(10);
  this['құпия_сөз'] = await bcrypt.hash(this['құпия_сөз'], salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this['құпия_сөз']);
};

export default mongoose.model<IUser>('User', UserSchema);
