import { RequestHandler } from 'express';
import { BookingService } from '../services/bookingService';

const bookingService = new BookingService();

export const createBooking: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { hotel_id, start_date, end_date, responsible_name } = req.body;
    
    const userId = req.user?.id; 

    if (!userId) {
      res.status(401).json({ error: 'Usuário não autenticado' });
      return;
    }

    const booking = await bookingService.createBooking({
      userId,
      hotelId: hotel_id, 
      start_date: start_date,
      end_date: end_date,
      responsible_name: responsible_name
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
    const bookings = await bookingService.listAll();
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};