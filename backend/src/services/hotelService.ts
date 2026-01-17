import { pool } from '../database/db';

interface CreateHotelDTO {
  name: string;
  city: string;
  address: string;
  stars: number;
  description: string;
  total_rooms: number;
  photo_url?: string; 
}

export class HotelService {
  
  async createHotel(data: CreateHotelDTO) {
    const { name, city, address, stars, description, total_rooms, photo_url } = data;

    const query = `
      INSERT INTO hotels (name, city, address, stars, description, total_rooms, photo_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [name, city, address, stars, description, total_rooms, photo_url || null];
  
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async listHotels() {
    const result = await pool.query('SELECT * FROM hotels ORDER BY created_at DESC');
    return result.rows;
  }


  async updateHotel(id: string, data: CreateHotelDTO) {
    const { name, city, address, stars, description, total_rooms, photo_url } = data;

    const query = `
      UPDATE hotels 
      SET name = $1, city = $2, address = $3, stars = $4, description = $5, total_rooms = $6, photo_url = $7
      WHERE id = $8
      RETURNING *
    `;
    
    const values = [name, city, address, stars, description, total_rooms, photo_url || null, id];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async deleteHotel(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM hotels WHERE id = $1 RETURNING id', [id]);
    
    return (result.rowCount ?? 0) > 0;
  }
}