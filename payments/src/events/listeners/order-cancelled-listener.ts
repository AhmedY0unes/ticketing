import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@ay-ms-pain/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import { Order } from '../../models/orders';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) {
      msg.ack();
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
