import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { pool } from './database/db';
import routes from './routes';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes); 

app.get('/', (req, res) => {
  res.json({ message: 'Hotel-Hub API is running 🚀' });
});

app.listen(PORT, async () => {
  try {
    await pool.query('SELECT 1');
    console.log(`Server running on port ${PORT}`);
    console.log(`Docs available at http://localhost:${PORT}/api-docs/`);
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
});