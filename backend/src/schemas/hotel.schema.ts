import { z } from 'zod';

export const createHotelSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Nome do hotel é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    address: z.string().min(5, 'Endereço deve ser completo'),
    stars: z.number().min(1).max(5),
    total_rooms: z.number().int().positive(),
    description: z.string().optional(),
    photo_url: z
      .url({ message: 'URL da foto inválida' })
      .optional()
      .or(z.literal('')),
  }),
});