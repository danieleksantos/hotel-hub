import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const bookingBody = z.object({
  hotel_id: z.uuid({ message: 'ID do hotel inválido' }),
  responsible_name: z.string().min(3, 'Nome do responsável é obrigatório'),
  start_date: z.string().regex(dateRegex, 'Data de check-in inválida (use YYYY-MM-DD)'),
  end_date: z.string().regex(dateRegex, 'Data de check-out inválida (use YYYY-MM-DD)'),
});

export const createBookingSchema = z.object({
  body: bookingBody.refine((data) => {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    return end > start;
  }, {
    message: "Data de check-out deve ser posterior ao check-in",
    path: ["end_date"],
  }),
});

export const updateBookingSchema = z.object({
  params: z.object({
    id: z.uuid({ message: 'ID da reserva inválido' }),
  }),
  body: bookingBody.partial().refine((data) => {
    if (data.start_date && data.end_date) {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end > start;
    }
    return true;
  }, {
    message: "Data de check-out deve ser posterior ao check-in",
    path: ["end_date"],
  }),
});

export const bookingIdSchema = z.object({
  params: z.object({
    id: z.uuid({ message: 'ID da reserva inválido' }),
  }),
});