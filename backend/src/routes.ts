import { Router } from 'express';
import { validate } from './middlewares/validateResource';
import { authMiddleware } from './middlewares/authMiddleware';
import { loginSchema } from './schemas/auth.schema';
import { createHotelSchema, hotelIdSchema } from './schemas/hotel.schema';
import { 
  createBookingSchema, 
  updateBookingSchema, 
  bookingIdSchema 
} from './schemas/booking.schema';
import { 
  createGuestSchema, 
  getGuestSchema, 
  updateGuestSchema, 
  guestIdSchema 
} from './schemas/guest.schema';

import { login } from './controllers/authController';
import { 
  createHotel, 
  listHotels, 
  updateHotel, 
  deleteHotel 
} from './controllers/hotelController';
import { 
  createBooking, 
  listAllBookings, 
  updateBooking, 
  deleteBooking 
} from './controllers/bookingController';
import { 
  addGuest, 
  listGuestsByBooking, 
  updateGuest, 
  removeGuest 
} from './controllers/guestController';

const router = Router();

// --- AUTH ---
router.post('/login', validate(loginSchema), login);

// --- HOTELS ---
router.post('/hotels', authMiddleware, validate(createHotelSchema), createHotel);
router.get('/hotels', authMiddleware, listHotels);
router.put('/hotels/:id', authMiddleware, validate(hotelIdSchema), validate(createHotelSchema), updateHotel);
router.delete('/hotels/:id', authMiddleware, validate(hotelIdSchema), deleteHotel);

// --- BOOKINGS ---
router.post('/bookings', authMiddleware, validate(createBookingSchema), createBooking);
router.get('/bookings', authMiddleware, listAllBookings);
router.put('/bookings/:id', authMiddleware, validate(updateBookingSchema), updateBooking);
router.delete('/bookings/:id', authMiddleware, validate(bookingIdSchema), deleteBooking);

// --- GUESTS ---
router.post('/guests', authMiddleware, validate(createGuestSchema), addGuest);
router.get('/bookings/:booking_id/guests', authMiddleware, validate(getGuestSchema), listGuestsByBooking);
router.put('/guests/:id', authMiddleware, validate(updateGuestSchema), updateGuest);
router.delete('/guests/:id', authMiddleware, validate(guestIdSchema), removeGuest);

export default router;