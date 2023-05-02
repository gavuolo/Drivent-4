import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';
import bookingService from '@/services/booking-service';

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
        const booking = await bookingService.createBooking(userId, roomId)
        return res.status(httpStatus.OK).send({bookingId: booking})
    } catch (error) {
        next(error)
    }
}

export async function putBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const { roomId } = req.body
    const  bookingId  = Number(req.params.bookingId)

    try {
        const bookingUpdated = await bookingService.updateBooking(userId, roomId, bookingId)
        return res.status(httpStatus.OK).send({bookingId: bookingUpdated})
    } catch (error) {
        next(error)
    }

}