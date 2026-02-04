import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

export const authMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no Token: Formato inválido' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatado' });
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("❌ [CRITICAL] JWT_SECRET não definido no ambiente.");
      return res.status(500).json({ error: 'Erro de configuração no servidor' });
    }

    const decoded = jwt.verify(token, secret);
    
    const { id, username } = decoded as TokenPayload;
    
    req.user = { id, username };

    return next();

  } catch (err: any) {
    console.error(`🔥 [AUTH ERROR] ${err.name}: ${err.message}`);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Sessão expirada. Por favor, faça login novamente.' });
    }

    return res.status(401).json({ error: 'Token inválido' });
  }
};