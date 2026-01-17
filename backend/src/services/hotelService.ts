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
}