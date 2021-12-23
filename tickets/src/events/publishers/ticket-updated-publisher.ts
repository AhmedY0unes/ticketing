import { Publisher, Subjects, TicketUpdatedEvent } from '@ay-ms-pain/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
