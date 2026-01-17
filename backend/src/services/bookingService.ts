import { pool } from '../database/db';

interface CreateBookingDTO {
  user_id: string;   
  hotel_id: string;  
  start_date: string;
  end_date: string;
  responsible_name: string;
}

export class BookingService {
  async createBooking({ user_id, hotel_id, start_date, end_date, responsible_name }: CreateBookingDTO) {
    
    const hotelCheck = await pool.query('SELECT total_rooms FROM hotels WHERE id = $1', [hotel_id]);
    if (hotelCheck.rows.length === 0) {
      throw new Error('HOTEL_NOT_FOUND');
    }

    const totalRooms = hotelCheck.rows[0].total_rooms;
    
    const availabilityCheck = await pool.query(
      `SELECT COUNT(*) FROM bookings 
       WHERE hotel_id = $1 
       AND (start_date < $3 AND end_date > $2)`,
      [hotel_id, start_date, end_date]
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
    const result = await pool.query(insertQuery, [user_id, hotel_id, start_date, end_date, responsible_name]);
    
    return result.rows[0];
  }

  async listAll() {
    const query = `
      SELECT 
          b.id, 
          h.name as hotel_name, 
          h.city, 
          h.photo_url as hotel_photo,
          b.start_date, 
          b.end_date, 
          b.responsible_name, 
          b.created_at,
          u.username as created_by,
          -- Subquery para contar hóspedes adicionais
          (SELECT COUNT(*) FROM guests g WHERE g.booking_id = b.id)::int as guest_count
      FROM bookings b
      JOIN hotels h ON b.hotel_id = h.id
      LEFT JOIN users u ON b.user_id = u.id
      ORDER BY b.start_date DESC
  `;
  const result = await pool.query(query);
  return result.rows;
}

async updateBooking(id: string, { start_date, end_date, responsible_name }: Partial<CreateBookingDTO>) {
    const query = `
      UPDATE bookings 
      SET start_date = $1, end_date = $2, responsible_name = $3 
      WHERE id = $4 
      RETURNING *
    `;
    const result = await pool.query(query, [start_date, end_date, responsible_name, id]);
    return result.rows[0];
  }

  async deleteBooking(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING id', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

