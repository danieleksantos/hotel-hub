import { Request, Response } from 'express';
import { pool } from '../database/db';

export const getHealth = async (req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    
    res.status(200).json({
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'DOWN',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};