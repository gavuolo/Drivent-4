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

async function createBooking(userId: number, roomId: number) {
   //encontrar o quarto pelo id 
   await checkRoom(roomId);
   //encontrar ingresso e ticket
   const ticket = await checkEnrollmentAndTicket(userId);
   //verificar o ticket
   await checkTicket(ticket)
   //criar 
   const booking = await bookingRepository.createBooking(userId, roomId)
   return booking.id
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
   return ticket
}

async function checkTicket(ticket: Ticket & {TicketType:TicketType}){
   if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
      throw forbiddenError()
  }
}


async function checkRoom(roomId: number){
   const room = await bookingRepository.findRoomById(roomId)
   if (room.capacity === 0) {
      throw forbiddenError()
   }
   if (!room){
      throw notFoundError()
   }
}

export default { findBookings, createBooking }