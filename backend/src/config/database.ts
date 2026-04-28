import mongoose from 'mongoose';

const MAX_RETRIES = 10;
const BASE_DELAY_MS = 1000;

const reconnectWithBackoff = (attempt: number): void => {
  if (attempt > MAX_RETRIES) {
    console.error('MongoDB: максималды қайта қосылу әрекеттері сарқылды. Сервер тоқтатылады.');
    process.exit(1);
  }
  const delay = Math.min(BASE_DELAY_MS * 2 ** attempt, 30_000);
  console.log(`MongoDB байланысы үзілді. ${delay}мс кейін қайта қосылуда (${attempt}/${MAX_RETRIES})...`);
  setTimeout(() => connectDB(attempt + 1), delay);
};

export const connectDB = async (attempt = 0): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kaz_crm';

  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB дереққорына сәтті қосылды');

    mongoose.connection.once('disconnected', () => reconnectWithBackoff(1));
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB қатесі:', err);
    });

  } catch (error) {
    console.error('MongoDB-ға қосылу мүмкін болмады:', error);
    reconnectWithBackoff(attempt + 1);
  }
};
