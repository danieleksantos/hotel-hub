import { Router } from 'express';
import { validate } from './middlewares/validateResource';
import { authMiddleware } from './middlewares/authMiddleware';

import { loginSchema } from './schemas/auth.schema';
import { createHotelSchema } from './schemas/hotel.schema';
import { createBookingSchema } from './schemas/booking.schema';
import { createGuestSchema, getGuestSchema } from './schemas/guest.schema';

import { login } from './controllers/authController';
import { createHotel, listHotels } from './controllers/hotelController';
import { createBooking, listAllBookings } from './controllers/bookingController';
import { addGuest, listGuestsByBooking } from './controllers/guestController';

const router = Router();

router.post('/login', validate(loginSchema), login);

router.post('/hotels', authMiddleware, validate(createHotelSchema), createHotel);
router.get('/hotels', authMiddleware, listHotels);

router.post('/bookings', authMiddleware, validate(createBookingSchema), createBooking);
router.get('/bookings', authMiddleware, listAllBookings);

router.post('/guests', authMiddleware, validate(createGuestSchema), addGuest);
router.get('/bookings/:booking_id/guests', authMiddleware, validate(getGuestSchema), listGuestsByBooking);

export default router;