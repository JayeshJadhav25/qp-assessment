import express from 'express';
import dotenv from 'dotenv';
import { checkDatabaseConnection } from "./config/database";
import { errorHandler } from './middlewares/errorHandler';

import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await checkDatabaseConnection(); 
});