import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express'; 
import { swaggerSpec } from './config/swagger';
import { pool } from './database/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ message: 'Hotel-Hub API is running 🚀' });
});

app.listen(PORT, async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log(`Server running on port ${PORT}`);
    console.log(`Docs available at http://localhost:${PORT}/api-docs`);
    console.log(`DB Connection Test: ${res.rows[0].now}`);
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
});