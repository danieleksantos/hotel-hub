import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const createConfig = (): PoolConfig => {
  const dbUrl = process.env.DATABASE_URL || '';
  
  const isLocal = dbUrl.includes('db-hotel-hub') || dbUrl.includes('localhost') || !dbUrl;

  if (dbUrl) {
    return {
      connectionString: dbUrl,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    };
  }

  return {
    host: process.env.DB_HOST || 'db-hotel-hub',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASS || 'admin123',
    database: process.env.DB_NAME || 'hotel_hub',
    ssl: false
  };
};

export const pool = new Pool(createConfig());

