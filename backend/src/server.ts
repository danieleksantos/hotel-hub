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

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https://validator.swagger.io", "*"], // Permitir imagens externas
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": ["'self'", "https:", "'unsafe-inline'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins: string[] = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) 
  : ['http://localhost:8080', 'http://localhost:5173'];

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

app.use(cors(corsOptions));
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url} - Origin: ${req.headers.origin}`);
    next();
  });
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Hotel-Hub API is running 🚀',
    docs: '/api-docs'
  });
});

app.use(routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  console.error(`🔥 [ERROR]: ${err.message}`);
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, async () => {
  try {
    const dbUrl = process.env.DATABASE_URL || '';
    const isLocal = dbUrl.includes('db-hotel-hub') || dbUrl.includes('localhost');
    
    await pool.query('SELECT 1');

    console.log('--------------------------------------------------');
    console.log(`✅ Database: Connected - Mode: ${isLocal ? 'Local (Docker)' : 'Cloud (Neon)'}`);
    console.log(`🔒 CORS: Whitelist -> ${allowedOrigins.join(', ')}`);
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📄 Swagger Docs: http://localhost:${PORT}/api-docs`);
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('❌ Critical Error during startup:', error);
    process.exit(1);
  }
});