import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kaz_crm';

  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB дереққорына сәтті қосылды');

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB байланысы үзілді. Қайта қосылуға тырысуда...');
      setTimeout(() => connectDB(), 5000);
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB қатесі:', err);
    });

  } catch (error) {
    console.error('MongoDB-ға қосылу мүмкін болмады:', error);
    process.exit(1);
  }
};
