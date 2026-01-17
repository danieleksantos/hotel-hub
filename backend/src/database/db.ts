import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
    }
    : {
        user: process.env.POSTGRES_USER || 'admin',
        host: process.env.POSTGRES_HOST || 'localhost',
        database: process.env.POSTGRES_DB || 'hotel_hub',
        password: process.env.POSTGRES_PASSWORD || 'admin',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
    };

export const pool = new Pool(poolConfig);

pool.on('connect', () => {
    console.log('✅ Connected to Database');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    process.exit(-1);
});