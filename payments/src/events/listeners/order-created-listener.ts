import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@ay-ms-pain/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import { Order } from '../../models/orders';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      version: data.version,
      status: data.status,
      userId: data.userId,
      price: data.ticket.price,
    });
    await order.save();

    msg.ack();
  }
}
