import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';
import bookingService from '@/services/booking-service';
import bookingRepository from '@/repositories/booking-repository';

export async function getBookings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req
    try {
        const bookings = await bookingService.findBookings(userId)
        return res.status(httpStatus.OK).send(bookings)
    } catch (error) {
        next(error)
    }
}

export async function postBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const { roomId } = req.body
    try {
        const booking = await bookingRepository.createBooking(userId, roomId)
        console.log("CONSOLANDO O BOOKING", booking)
        return res.status(httpStatus.OK).send(booking)
    } catch (error) {
        next(error)
    }
}