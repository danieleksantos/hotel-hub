import { pool } from '../database/db';

interface CreateBookingDTO {
  userId: string;
  hotelId: string;
  startDate: string;
  endDate: string;
  responsibleName: string;
}

export class BookingService {
  async createBooking({ userId, hotelId, startDate, endDate, responsibleName }: CreateBookingDTO) {
    const hotelCheck = await pool.query('SELECT total_rooms FROM hotels WHERE id = $1', [hotelId]);
    if (hotelCheck.rows.length === 0) {
      throw new Error('HOTEL_NOT_FOUND');
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
      throw new Error('NO_ROOMS_AVAILABLE');
    }

    const insertQuery = `
      INSERT INTO bookings (user_id, hotel_id, start_date, end_date, responsible_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [userId, hotelId, startDate, endDate, responsibleName]);
    
    return result.rows[0];
  }

  async listAll() {
      const query = `
        SELECT b.id, h.name as hotel_name, h.city, b.start_date, b.end_date, b.responsible_name, b.created_at
        FROM bookings b
        JOIN hotels h ON b.hotel_id = h.id
        ORDER BY b.start_date DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}