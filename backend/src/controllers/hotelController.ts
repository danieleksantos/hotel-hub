import { Request, Response } from 'express';
import { pool } from '../database/db';

export const createHotel = async (req: Request, res: Response) => {
  try {
    const { name, city, address, stars, description, total_rooms } = req.body;

    if (!name || !city || !address || !stars || !total_rooms) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO hotels (name, city, address, stars, description, total_rooms)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [name, city, address, stars, description, total_rooms];
    const result = await pool.query(query, values);
    return res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error creating hotel:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const listHotels = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM hotels ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch (error) {
    console.error('Error listing hotels:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};