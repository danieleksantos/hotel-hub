import { pool } from '../database/db';

interface CreateGuestDTO {
  bookingId: string;
  name: string;
  document: string;
}

export class GuestService {
  async createGuest({ bookingId, name, document }: CreateGuestDTO) {
    try {
      const query = `
        INSERT INTO guests (booking_id, name, document)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      
      const result = await pool.query(query, [bookingId, name, document]);
      return result.rows[0];

    } catch (error: any) {
      if (error.code === '23503') {
        throw new Error('BOOKING_NOT_FOUND');
      }
      throw error; 
    }
  }

  async listByBookingId(bookingId: string) {
    const query = `SELECT * FROM guests WHERE booking_id = $1 ORDER BY name ASC`;
    const result = await pool.query(query, [bookingId]);
    return result.rows;
  }
}