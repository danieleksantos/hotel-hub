import { RequestHandler } from 'express';
import { HotelService } from '../services/hotelService';

const hotelService = new HotelService();

export const createHotel: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const hotelData = req.body;
    const hotel = await hotelService.createHotel(hotelData);

    res.status(201).json(hotel);
  } catch (error) {
    next(error);
  }
};

export const listHotels: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const hotels = await hotelService.listHotels();
    res.json(hotels);
  } catch (error) {
    next(error);
  }
};
