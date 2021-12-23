import { Subjects } from './subjects';
import { OrderStatus } from './types/order-status';

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string; // for payment service
    userId: string; // for payment service
    expiresAt: string; // for expiration service
    status: OrderStatus;
    version: number;
    ticket: {
      id: string; //for ticket service
      price: number; //for payment service
    };
  };
}
