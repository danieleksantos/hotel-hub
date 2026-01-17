import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { pool } from '../database/db';

export class AuthService {
  async authenticate(username: string, password: string) {
    const client = await pool.connect();

    try {
      const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];

      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      const passwordMatch = await compare(password, user.password_hash);

      if (!passwordMatch) {
        throw new Error('INVALID_PASSWORD');
      }

      const token = sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || 'secret_default',
        { expiresIn: '1d' }
      );

      return { token, user: { id: user.id, username: user.username } };

    } finally {
      client.release();
    }
  }
}