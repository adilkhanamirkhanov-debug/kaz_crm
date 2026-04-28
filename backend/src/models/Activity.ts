import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  _id: mongoose.Types.ObjectId;
  тақырып: string;
  түрі: 'қоңырау' | 'кездесу' | 'тапсырма' | 'эл_пошта';
  сипаттамасы?: string;
  клиент: mongoose.Types.ObjectId;
  менеджер: mongoose.Types.ObjectId;
  күні: Date;
  статус: 'жоспарланған' | 'орындалды' | 'күтіліп_жатыр' | 'болдырылмады';
  жасалған_уақыт: Date;
}

const ActivitySchema = new Schema<IActivity>({
  тақырып: { type: String, required: true, trim: true },
  түрі: { type: String, enum: ['қоңырау', 'кездесу', 'тапсырма', 'эл_пошта'], required: true },
  сипаттамасы: { type: String },
  клиент: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  менеджер: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  күні: { type: Date, required: true },
  статус: {
    type: String,
    enum: ['жоспарланған', 'орындалды', 'күтіліп_жатыр', 'болдырылмады'],
    default: 'жоспарланған',
  },
  жасалған_уақыт: { type: Date, default: Date.now },
});

export default mongoose.model<IActivity>('Activity', ActivitySchema);
