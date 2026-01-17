import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createBookingSchema = z.object({
  body: z.object({
    hotelId: z.uuid({ message: 'ID do hotel inválido' }),
    responsible_name: z.string().min(3, 'Nome do responsável é obrigatório'),
    startDate: z.string().regex(dateRegex, 'Data de check-in inválida (use YYYY-MM-DD)'),
    endDate: z.string().regex(dateRegex, 'Data de check-out inválida (use YYYY-MM-DD)'),
  })
  .refine((data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end > start;
  }, {
    message: "Data de check-out deve ser posterior ao check-in",
    path: ["endDate"],
  }),
});