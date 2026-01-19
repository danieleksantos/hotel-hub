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

export const guestIdSchema = z.object({
  params: z.object({
    id: z.uuid({ message: 'ID do hóspede inválido' }),
  }),
});

export const updateGuestSchema = z.object({
  params: z.object({
    id: z.uuid({ message: 'ID do hóspede inválido' }),
  }),
  body: z.object({
    name: z.string().min(5, 'Nome do hóspede deve ter pelo menos 5 caracteres').optional(),
    document: z.string().min(9, 'Documento deve ter pelo menos 9 caracteres').optional(),
  }).refine((data) => data.name || data.document, {
    message: "Pelo menos um campo (nome ou documento) deve ser fornecido para atualização",
  }),
});