import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const createConfig = (): PoolConfig => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASS || 'admin',
    database: process.env.DB_NAME || 'hotel_hub',
    ssl: false
  };
};

export const pool = new Pool(createConfig());

pool.on('connect', () => {
    const mode = process.env.DATABASE_URL ? 'Cloud (Neon)' : 'Local (Docker)';
    console.log(`✅ Database connected - Mode: ${mode}`);
});