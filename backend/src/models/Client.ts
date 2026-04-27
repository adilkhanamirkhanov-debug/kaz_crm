import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
  _id: mongoose.Types.ObjectId;
  аты: string;
  эл_пошта: string;
  телефон: string;
  компания?: string;
  мекен_жай?: string;
  статус: 'белсенді' | 'болашақ' | 'бұрынғы';
  сатып_алу_тарихы: Array<{ өнім: string; сомасы: number; күні: Date }>;
  жауапты_менеджер: mongoose.Types.ObjectId;
  ескертпелер?: string;
  жасалған_уақыт: Date;
}

const ClientSchema = new Schema<IClient>({
  аты: { type: String, required: true, trim: true },
  эл_пошта: { type: String, required: true, trim: true },
  телефон: { type: String, required: true, trim: true },
  компания: { type: String, trim: true },
  мекен_жай: { type: String, trim: true },
  статус: { type: String, enum: ['белсенді', 'болашақ', 'бұрынғы'], default: 'болашақ' },
  сатып_алу_тарихы: [
    {
      өнім: { type: String },
      сомасы: { type: Number },
      күні: { type: Date },
    },
  ],
  жауапты_менеджер: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ескертпелер: { type: String },
  жасалған_уақыт: { type: Date, default: Date.now },
});

export default mongoose.model<IClient>('Client', ClientSchema);
