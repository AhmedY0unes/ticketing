import { Publisher, OrderCreatedEvent, Subjects } from '@ay-ms-pain/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

//Usage: new OrderCreatedPublisher(narsClient).publish({data});
