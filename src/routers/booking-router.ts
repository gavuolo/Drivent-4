import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBookings, postBooking } from '@/controllers/booking-controller';

const bookingRouter = Router()

bookingRouter.all('/*', authenticateToken)
bookingRouter.get('/', getBookings)
bookingRouter.post('/', postBooking)

export { bookingRouter }