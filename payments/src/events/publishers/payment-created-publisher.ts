import { Subjects, Publisher, PaymentCreatedEvent } from '@ay-ms-pain/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
