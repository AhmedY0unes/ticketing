import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@ay-ms-pain/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
