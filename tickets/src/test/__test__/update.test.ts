import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({
      title: 'sjfd',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'sjfd',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: 'kfghk',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', signin())
    .send({
      title: 'fjhgkj',
      price: 200,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = signin();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'kfghk',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'fjhgkj',
      price: -10,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      price: 10,
    })
    .expect(400);
});

it('Updates the ticket provided valid inputs', async () => {
  const cookie = signin();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'kfghk',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'fjhgkj',
      price: 152,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('fjhgkj');
  expect(ticketResponse.body.price).toEqual(152);
});

it('publishes an event', async () => {
  const cookie = signin();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'kfghk',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'fjhgkj',
      price: 152,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is resrved', async () => {
  const cookie = signin();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'kfghk',
      price: 20,
    });
  const ticket = await Ticket.findById(res.body.id);
  if (ticket !== null) {
    ticket.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await ticket.save();
  }
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'fjhgkj',
      price: 152,
    })
    .expect(400);
  1;
});
