import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/orders';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';
import { OrderStatus } from '@ay-ms-pain/common';

it('has a route handler listening to /api/orders for post requests', async () => {
  const response = await request(app).post('/api/orders').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/orders').send({}).expect(401);

  // expect(response.status).not.toEqual(404);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if the ticket doesn't exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  // console.log(ticketId);

  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  // Create a ticket
  const id = new mongoose.Types.ObjectId();
  const ticket = Ticket.build({
    id: String(id),
    title: 'concert',
    price: 1000,
  });
  await ticket.save();
  // create an order with the prevously reated ticket
  const order = Order.build({
    userId: '12233654s',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();
  // make a request to book that ticket
  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  // Create a ticket
  const id = new mongoose.Types.ObjectId();
  const ticket = Ticket.build({
    id: String(id),
    title: 'concert',
    price: 1000,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event', async () => {
  // Create a ticket
  const id = new mongoose.Types.ObjectId();
  const ticket = Ticket.build({
    id: String(id),
    title: 'concert',
    price: 1000,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  // console.log(natsWrapper);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
