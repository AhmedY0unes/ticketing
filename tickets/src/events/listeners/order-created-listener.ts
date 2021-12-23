import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  Subjects,
} from '@ay-ms-pain/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket Not Found');
    }
    // mark the ticket as being reserved by setting its orderId
    ticket.set({ orderId: data.id });
    // save a ticket
    await ticket.save();
    // await here is so that if any error occurs we throw an error and never go down to ack.
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });
    // ack the message
    msg.ack();
  }
}
