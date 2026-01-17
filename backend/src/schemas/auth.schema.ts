import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    username: z
      .string({ message: 'Username deve ser um texto' }) 
      .min(1, 'Username é obrigatório') 
      .min(3, 'Username deve ter no mínimo 3 caracteres'),
      
    password: z
      .string({ message: 'Senha deve ser um texto' })
      .min(1, 'Senha é obrigatória')
      .min(6, 'Senha deve ter no mínimo 6 caracteres'),
  }),
});