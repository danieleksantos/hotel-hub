import { RequestHandler } from 'express';
import { GuestService } from '../services/guestService';

const guestService = new GuestService();

interface GuestParams {
  booking_id: string;
}

export const addGuest: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { booking_id, name, document } = req.body;
    const guest = await guestService.createGuest({ booking_id, name, document });

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
    const { booking_id } = req.params as unknown as GuestParams; 
    const guests = await guestService.listByBookingId(booking_id);

    res.json(guests);
  } catch (error) {
    next(error);
  }
};