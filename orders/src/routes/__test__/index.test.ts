import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/orders';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';
import { OrderStatus } from '@ay-ms-pain/common';

it('has a route handler listening to /api/orders for get requests', async () => {
  const response = await request(app).get('/api/orders').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).get('/api/orders').send({}).expect(401);

  // expect(response.status).not.toEqual(404);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', signin())
    .send({});

  expect(response.status).not.toEqual(401);
});
const buildTicket = async () => {
  // Create a ticket
  const id = new mongoose.Types.ObjectId();
  const ticket = Ticket.build({
    id: String(id),
    title: 'concert',
    price: 1000,
  });
  await ticket.save();

  return ticket;
};

it('fetches orders for a particular user', async () => {
  // Create three tickets
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();
  // Create 1 order as User #1
  const user1 = signin();
  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);
  // Create 2 order as User #2
  const user2 = signin();
  const { body: order1 } = await request(app) // destructure the response and name it at the same step.
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);
  // make a request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);
  // console.log(response.body);
  // Make sure we only got the orders for the User #2

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order1.id);
  expect(response.body[1].id).toEqual(order2.id);
  expect(response.body[0].ticket.id).toEqual(ticket2.id);
  expect(response.body[1].ticket.id).toEqual(ticket3.id);
});
