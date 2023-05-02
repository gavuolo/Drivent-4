import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createBooking(userId: number, roomId: number) {
    return prisma.booking.create({
        data: {
            userId,
            roomId,
        }
    })
}

export async function createRoomFull(hotelId: number) {
    return prisma.room.create({
        data: {
            name: faker.name.findName(),
            capacity: 0,
            hotelId,
        }
    })
}
