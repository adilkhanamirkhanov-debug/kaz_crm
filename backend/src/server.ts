import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';
import { authRateLimiter, generalRateLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import clientRoutes from './routes/clients';
import saleRoutes from './routes/sales';
import activityRoutes from './routes/activities';
import dashboardRoutes from './routes/dashboard';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/users', generalRateLimiter, userRoutes);
app.use('/api/clients', generalRateLimiter, clientRoutes);
app.use('/api/sales', generalRateLimiter, saleRoutes);
app.use('/api/activities', generalRateLimiter, activityRoutes);
app.use('/api/dashboard', generalRateLimiter, dashboardRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req, res) => {
  res.json({ статус: 'Жұмыс істеп тұр', уақыт: new Date().toISOString() });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Сервер ${PORT} портында іске қосылды`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  });
});

export default app;
