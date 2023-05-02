import { notFoundError, forbiddenError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { Ticket, TicketType } from "@prisma/client";

async function findBookings(userId: number) {
   const booking = await bookingRepository.findBookingByUserId(userId)
   if (!booking) {
      throw notFoundError()
   }
   const response = {
      id: booking.id,
      Room: booking.Room
   }
   return response
}

async function checkEnrollmentAndTicket(userId: number){
   const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
   if(!enrollment) {
       throw notFoundError()
   }
   const enrollmentId = enrollment.id
   const ticket: Ticket & {TicketType: TicketType} = await ticketsRepository.findTicketByEnrollmentId(enrollmentId)
   if(!ticket) {
       throw notFoundError()
   }
   await checkTicket(ticket)
}

async function checkTicket(ticket: Ticket & {TicketType:TicketType}){
   if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel){
      throw forbiddenError()
  }
}

async function checkRoom(roomId: number){
   const room = await bookingRepository.findRoomById(roomId)
   if (!room){
      throw notFoundError()
   }
   if (room.capacity === 0) {
      throw forbiddenError()
   }
}

async function createBooking(userId: number, roomId: number) {
   await checkEnrollmentAndTicket(userId);
   await checkRoom(roomId);
   
   //criar 
   const booking = await bookingRepository.createBooking(userId, roomId)
   return booking.id
}
export default { findBookings, createBooking }