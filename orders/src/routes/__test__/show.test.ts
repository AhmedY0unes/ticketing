import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/orders';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';
import { OrderStatus } from '@ay-ms-pain/common';

it('has a route handler listening to /api/orders for get requests', async () => {
  const orderId = new mongoose.Types.ObjectId();
  const response = await request(app).get(`/api/orders/${orderId}`).send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const orderId = new mongoose.Types.ObjectId();
  const response = await request(app)
    .get(`/api/orders/${orderId}`)
    .send({})
    .expect(401);

  // expect(response.status).not.toEqual(404);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const orderId = new mongoose.Types.ObjectId();
  const response = await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Cookie', signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('fetches a particular order of a particural user', async () => {
  // Create a ticket
  const id = new mongoose.Types.ObjectId();
  const ticket = Ticket.build({
    id: String(id),
    title: 'concert',
    price: 1000,
  });
  await ticket.save();
  const user = signin();
  // make a request to build an order with the ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  //make a request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
  // Create a ticket
  const id = new mongoose.Types.ObjectId();
  const ticket = Ticket.build({
    id: String(id),
    title: 'concert',
    price: 1000,
  });
  await ticket.save();
  const user = signin();
  const user2 = signin();
  // make a request to build an order with the ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket.id })
    .expect(201);
  //make a request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(401);
});
