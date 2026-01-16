import { Router } from 'express';
import { login } from './controllers/authController';
import { createHotel, listHotels } from './controllers/hotelController';
import { createBooking, listAllBookings } from './controllers/bookingController';
import { authMiddleware } from './middlewares/authMiddleware';

const router = Router();

router.post('/login', login);

router.post('/hotels', authMiddleware, createHotel);
router.get('/hotels', authMiddleware, listHotels);

router.post('/bookings', authMiddleware, createBooking);
router.get('/bookings', authMiddleware, listAllBookings);

export default router;