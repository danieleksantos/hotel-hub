import { z } from 'zod';

export const createGuestSchema = z.object({
  body: z.object({
    booking_id: z.uuid({ message: 'ID da reserva inválido (deve ser UUID)' }),
    name: z.string().min(2, 'Nome do hóspede é obrigatório'),
    document: z.string().min(5, 'Documento é obrigatório'),
  }),
});

export const getGuestSchema = z.object({
  params: z.object({
    booking_id: z.uuid({ message: 'ID da reserva inválido na URL' }),
  }),
});