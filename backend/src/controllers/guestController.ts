import { Request, Response } from 'express';
import { pool } from '../database/db';

export const addGuest = async (req: Request, res: Response) => {
  try {
    const { bookingId, name, document } = req.body;

    if (!bookingId || !name || !document) {
      return res.status(400).json({ error: 'Missing required fields (bookingId, name, document)' });
    }

    const query = `
      INSERT INTO guests (booking_id, name, document)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await pool.query(query, [bookingId, name, document]);

    return res.status(201).json({
        message: 'Hóspede adicionado com sucesso!',
        guest: result.rows[0]
    });

  } catch (error) {
    console.error('Error adding guest:', error);
    if ((error as any).code === '23503') {
        return res.status(404).json({ error: 'Reserva não encontrada (bookingId inválido)' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const listGuestsByBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params; 

    const query = `SELECT * FROM guests WHERE booking_id = $1 ORDER BY name ASC`;
    const result = await pool.query(query, [bookingId]);

    return res.json(result.rows);

  } catch (error) {
    console.error('Error listing guests:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};