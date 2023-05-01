import { prisma } from "@/config";

async function findBookingByUserId(userId: number) {
    return prisma.booking.findFirst({
        where: { userId },
        include: { Room: true }
    })
}

export default {findBookingByUserId}