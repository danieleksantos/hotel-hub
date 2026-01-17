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

export const updateHotel: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const id = req.params.id as string;
    const hotelData = req.body;
    
    const updatedHotel = await hotelService.updateHotel(id, hotelData);

    if (!updatedHotel) {
      res.status(404).json({ error: 'Hotel não encontrado' });
      return;
    }

    res.json(updatedHotel);
  } catch (error) {
    next(error);
  }
};

export const deleteHotel: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const id = req.params.id as string;
    const success = await hotelService.deleteHotel(id);

    if (!success) {
      res.status(404).json({ error: 'Hotel não encontrado' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};