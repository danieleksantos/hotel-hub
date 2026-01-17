import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { pool } from './database/db';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(helmet({
  crossOriginResourcePolicy: false, 
  contentSecurityPolicy: false,    
}));


app.use(cors({ origin: '*' }));

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ message: 'Hotel-Hub API is running 🚀' });
});

app.use(routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 Erro Capturado:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    status: 'error',
    message
  });
});

app.listen(PORT, async () => {
  try {
    await pool.query('SELECT 1');
    console.log(`✅ Database connected successfully`);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 Docs available at http://localhost:${PORT}/api-docs/`);
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);

  }
});