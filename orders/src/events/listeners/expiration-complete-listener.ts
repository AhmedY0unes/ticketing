import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  ExpirationCompleteEvent,
  OrderStatus,
} from '@ay-ms-pain/common';
import { Order } from '../../models/orders';
import { queueGroupName } from './queue-group-name';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  // is to make sure an event gets processed by only one copy of this service not all of them
  //(if we choose to create multiple copies of the same service)
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }
    // a condition for if the order is payed for
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }
    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    // acknowledge that the event have been processed
    msg.ack();
  }
}
