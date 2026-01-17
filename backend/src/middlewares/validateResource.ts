import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validate = (schema: ZodObject<any, any>) => (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    next();
  } catch (e: any) {
    if (e instanceof ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Erro de validação',
        errors: e.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({ error: 'Erro interno de validação' });
  }
};