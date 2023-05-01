import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";

async function findBookings(userId: number){
 const booking = await bookingRepository.findBookingByUserId(userId)
 if(!booking){
    throw notFoundError()
 }
 const response = {
    id: booking.id,
    Room: booking.Room
 }
 return response
}

export default { findBookings }