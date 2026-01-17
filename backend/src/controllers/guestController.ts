import { RequestHandler } from 'express';
import { GuestService } from '../services/guestService';

const guestService = new GuestService();

interface GuestParams {
  bookingId: string;
}

export const addGuest: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { bookingId, name, document } = req.body;
    const guest = await guestService.createGuest({ bookingId, name, document });

    res.status(201).json({
        message: 'Hóspede adicionado com sucesso!',
        guest
    });
  } catch (error: any) {
    if (error.message === 'BOOKING_NOT_FOUND') {
        res.status(404).json({ error: 'Reserva não encontrada' });
        return;
    }
    next(error);
  }
};

export const listGuestsByBooking: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { bookingId } = req.params as unknown as GuestParams; 
    const guests = await guestService.listByBookingId(bookingId);

    res.json(guests);
  } catch (error) {
    next(error);
  }
};