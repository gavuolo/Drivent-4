import { prisma } from "@/config";

async function findBookingByUserId(userId: number) {
    return prisma.booking.findFirst({
        where: { userId },
        include: { Room: true }
    })
}
async function createBooking(userId: number, roomId: number){
    return prisma.booking.create({
        data:{
            roomId,
            userId
        }
    })
}

async function findRoomById(roomId: number){
    return prisma.room.findFirst({
        where:{
            id: roomId
        }
    })
}
export default {findBookingByUserId, createBooking, findRoomById}