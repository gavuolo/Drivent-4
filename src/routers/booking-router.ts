import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBookings, postBooking, putBooking } from '@/controllers/booking-controller';

const bookingRouter = Router()

bookingRouter.all('/*', authenticateToken)
bookingRouter.get('/', getBookings)
bookingRouter.post('/', postBooking)
bookingRouter.put('/:bookingId', putBooking)

export { bookingRouter }