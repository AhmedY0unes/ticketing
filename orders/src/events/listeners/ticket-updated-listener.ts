import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
  NotFoundError,
} from '@ay-ms-pain/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  // is to make sure an event gets processed by only one copy of this service not all of them
  //(if we choose to create multiple copies of the same service)
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // find the ticket in the orders DB that was just updated.
    const ticket = await Ticket.findByIdAndPreviousVersion(data);
    if (!ticket) {
      throw new Error('Ticket not Found');
    }
    const { title, price } = data;
    ticket.set({ title, price });

    await ticket.save();
    // acknowledge that the event have been processed
    msg.ack();
  }
}
