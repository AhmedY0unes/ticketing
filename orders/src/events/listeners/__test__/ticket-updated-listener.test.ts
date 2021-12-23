import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import mongoose from 'mongoose';
import { TicketUpdatedEvent } from '@ay-ms-pain/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  //Create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'Hello',
    version: ticket.version + 1,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 666,
  };
  // create a fake msg object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  // return all above
  return { listener, data, ticket, msg };
};

it('finds, updates, and saves a ticket', async () => {
  const { msg, listener, data, ticket } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  // console.log(updatedTicket, ticket);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { msg, listener, data } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not all ack if the event has a skipped version number', async () => {
  const { msg, data, listener, ticket } = await setup();

  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (e) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
