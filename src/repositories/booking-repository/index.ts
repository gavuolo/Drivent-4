import { prisma } from "@/config";

async function findBookingByUserId(userId: number) {
    return prisma.booking.findFirst({
        where: { userId },
        include: { Room: true }
    })
}
async function createBooking(userId: number, roomId: number) {
    return prisma.booking.create({
        data: {
            roomId,
            userId
        }
    })
}

async function findRoomById(roomId: number) {
    return prisma.room.findFirst({
        where: {
            id: roomId
        }
    })
}

async function updateBooking(roomId: number, bookingId: number) {
    return prisma.booking.update({
        where: {
            id: bookingId
        },
        data: {
            roomId,
        }
    })
}
export default { findBookingByUserId, createBooking, findRoomById, updateBooking }