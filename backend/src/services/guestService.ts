import { pool } from '../database/db';

interface CreateGuestDTO {
  booking_id: string;
  name: string;
  document: string;
}

interface UpdateGuestDTO {
  name?: string;
  document?: string;
}

export class GuestService {
  async createGuest({ booking_id, name, document }: CreateGuestDTO) {
    try {
      const query = `
        INSERT INTO guests (booking_id, name, document)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      
      const result = await pool.query(query, [booking_id, name, document]);
      return result.rows[0];

    } catch (error: any) {
      if (error.code === '23503') {
        throw new Error('BOOKING_NOT_FOUND');
      }
      throw error; 
    }
  }

  async listByBookingId(booking_id: string) {
    const query = `SELECT * FROM guests WHERE booking_id = $1 ORDER BY name ASC`;
    const result = await pool.query(query, [booking_id]);
    return result.rows;
  }

  async updateGuest(id: string, { name, document }: UpdateGuestDTO) {
    const currentGuest = await pool.query('SELECT * FROM guests WHERE id = $1', [id]);
    
    if (currentGuest.rows.length === 0) {
      throw new Error('GUEST_NOT_FOUND');
    }

    const query = `
      UPDATE guests 
      SET name = COALESCE($1, name), 
          document = COALESCE($2, document)
      WHERE id = $3
      RETURNING *
    `;

    const result = await pool.query(query, [name, document, id]);
    return result.rows[0];
  }

  async deleteGuest(id: string) {
    const query = `DELETE FROM guests WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new Error('GUEST_NOT_FOUND');
    }

    return { message: 'Guest deleted successfully' };
  }
}