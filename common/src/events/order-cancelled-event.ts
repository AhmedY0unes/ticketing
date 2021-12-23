import { Subjects } from './subjects';

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    id: string; // for payment service to refund.
    version: number;
    ticket: {
      id: string; // for ticket service to unlock it
    };
  };
}
