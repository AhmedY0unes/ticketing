import { Publisher, Subjects, TicketCreatedEvent } from '@ay-ms-pain/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
