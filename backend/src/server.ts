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

const allowedOrigins: string[] = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) 
  : [];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};


app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https://validator.swagger.io"],
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": ["'self'", "https:", "'unsafe-inline'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${req.method}] ${req.url} - Origin: ${req.headers.origin}`);
  }
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ message: 'Hotel-Hub API is running 🚀' });
});

app.use(routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, async () => {
  try {
    await pool.query('SELECT 1');
    console.log(`✅ Database: Connected (Neon/Postgres)`);
    console.log(`🔒 CORS: Whitelist -> ${allowedOrigins.join(', ')}`);
    console.log(`🚀 Server: http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Critical Error during startup:', error);
    process.exit(1);
  }
});