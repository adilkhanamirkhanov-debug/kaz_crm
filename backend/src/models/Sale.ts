import mongoose, { Document, Schema } from 'mongoose';

export interface ISale extends Document {
  _id: mongoose.Types.ObjectId;
  тақырып: string;
  клиент: mongoose.Types.ObjectId;
  менеджер: mongoose.Types.ObjectId;
  сомасы: number;
  статус: 'жаңа' | 'келіссөздер' | 'ұсыныс' | 'жеңілген' | 'жеңілді';
  сатыс?: string;
  мүмкіндік_пайызы: number;
  болжамды_жабылу: Date;
  жасалған_уақыт: Date;
}

const SaleSchema = new Schema<ISale>({
  тақырып: { type: String, required: true, trim: true },
  клиент: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  менеджер: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  сомасы: { type: Number, required: true, min: 0 },
  статус: { type: String, enum: ['жаңа', 'келіссөздер', 'ұсыныс', 'жеңілген', 'жеңілді'], default: 'жаңа' },
  сатыс: { type: String },
  мүмкіндік_пайызы: { type: Number, min: 0, max: 100, default: 0 },
  болжамды_жабылу: { type: Date, required: true },
  жасалған_уақыт: { type: Date, default: Date.now },
});

export default mongoose.model<ISale>('Sale', SaleSchema);
