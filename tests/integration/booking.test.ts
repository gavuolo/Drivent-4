import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { createEnrollmentWithAddress, createHotel, createPayment, createRoomWithHotelId, createTicket, createTicketTypeRemote, createTicketTypeWithHotel, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import { TicketStatus } from '@prisma/client';
import { createBooking } from '../factories/booking-factory';

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {

        it('should respond with status 404 when user not booked a room ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 and a list of booking', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);

            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)
            const booking = await createBooking(user.id, room.id)
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);

            expect(response.body).toEqual(
                expect.objectContaining({
                    id: booking.id,
                    Room: {
                        id: room.id,
                        name: room.name,
                        capacity: room.capacity,
                        hotelId: room.hotelId,
                        createdAt: room.createdAt.toISOString(),
                        updatedAt: room.updatedAt.toISOString(),
                    }
                })
            );
        });
    });
});

describe('POST /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {

        it('should respond with status 404 when roomId not exist ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);

            const hotel = await createHotel();
            await createRoomWithHotelId(hotel.id)

             const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({roomId: 0})

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        // it('should respond with status 200 and a list of booking', async () => {
        //     const user = await createUser();
        //     const token = await generateValidToken(user);
        //     const enrollment = await createEnrollmentWithAddress(user);
        //     const ticketType = await createTicketTypeWithHotel();
        //     const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        //     const payment = await createPayment(ticket.id, ticketType.price);

        //     const hotel = await createHotel();
        //     const room = await createRoomWithHotelId(hotel.id)
        //     const booking = await createBooking(user.id, room.id)
        //     const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        //     expect(response.status).toEqual(httpStatus.OK);

        //     expect(response.body).toEqual(
        //         expect.objectContaining({
        //             id: booking.id,
        //             Room: {
        //                 id: room.id,
        //                 name: room.name,
        //                 capacity: room.capacity,
        //                 hotelId: room.hotelId,
        //                 createdAt: room.createdAt.toISOString(),
        //                 updatedAt: room.updatedAt.toISOString(),
        //             }
        //         })
        //     );
        // });

        //200 de sucesso
        //roomId não existente: Deve retornar status code 404.
        //roomId sem vaga: Deve retornar status code 403.
        //Fora da regra de negócio: Deve retornar status code 403. (ex: usuário não tem nem booking.)
    });
});