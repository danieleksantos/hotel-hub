import { Router } from 'express';
import { login } from './controllers/authController';
import { createHotel, listHotels } from './controllers/hotelController';
import { createBooking, listAllBookings } from './controllers/bookingController';
import { addGuest, listGuestsByBooking } from './controllers/guestController'; 
import { authMiddleware } from './middlewares/authMiddleware';

const router = Router();

// --- AUTH ---
router.post('/login', login);

// --- HOTÉIS ---
router.post('/hotels', authMiddleware, createHotel);
router.get('/hotels', authMiddleware, listHotels);

// --- RESERVAS ---
router.post('/bookings', authMiddleware, createBooking);
router.get('/bookings', authMiddleware, listAllBookings);

// --- HÓSPEDES  ---
router.post('/guests', authMiddleware, addGuest);
router.get('/bookings/:bookingId/guests', authMiddleware, listGuestsByBooking);

export default router;