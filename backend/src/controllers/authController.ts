import { RequestHandler } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export const login: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { username, password } = req.body;
    const result = await authService.authenticate(username, password);

    res.json(result);

  } catch (error: any) {
    if (error.message === 'USER_NOT_FOUND' || error.message === 'INVALID_PASSWORD') {
       res.status(401).json({ error: 'Credenciais inválidas' });
       return;
    }
    next(error);
  }
};