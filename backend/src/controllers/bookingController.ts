import { RequestHandler } from 'express';
import { BookingService } from '../services/bookingService';

const bookingService = new BookingService();

export const createBooking: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { hotel_id, start_date, end_date, responsible_name } = req.body;
    const user_id = req.user?.id; 

    if (!user_id) {
      res.status(401).json({ error: 'Usuário não autenticado' });
      return;
    }

    const booking = await bookingService.createBooking({
      user_id,
      hotel_id, 
      start_date,
      end_date,
      responsible_name
    });

    res.status(201).json({
        message: 'Reserva confirmada!',
        booking
    });

  } catch (error: any) {
    if (error.message === 'HOTEL_NOT_FOUND') {
        res.status(404).json({ error: 'Hotel não encontrado' });
        return;
    }
    if (error.message === 'NO_ROOMS_AVAILABLE') {
        res.status(409).json({ error: 'Sem quartos disponíveis para este período' });
        return;
    }
    next(error);
  }
};

export const listAllBookings: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const bookings = await bookingService.listAllBookings();
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const updateBooking: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await bookingService.updateBooking(id as string, req.body);
    res.json(updated);
  } catch (error: any) {
    if (error.message === 'BOOKING_NOT_FOUND') {
      res.status(404).json({ error: 'Reserva não encontrada' });
      return;
    }
    next(error);
  }
};

export const deleteBooking: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { id } = req.params;
    await bookingService.deleteBooking(id as string);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'BOOKING_NOT_FOUND') {
      res.status(404).json({ error: 'Reserva não encontrada' });
      return;
    }
    next(error);
  }
};