import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@ay-ms-pain/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  // is to make sure an event gets processed by only one copy of this service not all of them
  //(if we choose to create multiple copies of the same service)
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    // acknowledge that the event have been processed
    msg.ack();
  }
}
