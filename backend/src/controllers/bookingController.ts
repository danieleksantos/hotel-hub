import { Request, Response } from 'express';
import { pool } from '../database/db';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { hotelId, startDate, endDate, responsible_name } = req.body;
    const userId = (req as any).userId;

    if (!hotelId || !startDate || !endDate || !responsible_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ error: 'Data de fim deve ser posterior à data de início' });
    }

    const hotelCheck = await pool.query('SELECT total_rooms FROM hotels WHERE id = $1', [hotelId]);

    if (hotelCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const totalRooms = hotelCheck.rows[0].total_rooms;

    const availabilityCheck = await pool.query(
      `SELECT COUNT(*) FROM bookings 
       WHERE hotel_id = $1 
       AND (start_date < $3 AND end_date > $2)`, 
      [hotelId, startDate, endDate]
    );

    const activeBookings = parseInt(availabilityCheck.rows[0].count);

    if (activeBookings >= totalRooms) {
      return res.status(409).json({ error: 'Sem quartos disponíveis para este período.' });
    }

    const insertQuery = `
      INSERT INTO bookings (user_id, hotel_id, start_date, end_date, responsible_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await pool.query(insertQuery, [userId, hotelId, startDate, endDate, responsible_name]);

    return res.status(201).json({
        message: 'Reserva confirmada!',
        booking: result.rows[0]
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const listAllBookings = async (req: Request, res: Response) => {
  try {
    const query = `
        SELECT b.id, h.name as hotel_name, h.city, b.start_date, b.end_date, b.responsible_name, b.created_at
        FROM bookings b
        JOIN hotels h ON b.hotel_id = h.id
        ORDER BY b.start_date DESC
    `;

    const result = await pool.query(query);
    return res.json(result.rows);

  } catch (error) {
    console.error('Error listing bookings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};