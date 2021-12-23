import { Publisher, OrderCancelledEvent, Subjects } from '@ay-ms-pain/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

//Usage: new OrderCancelledPublisher(narsClient).publish({data});
