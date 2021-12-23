import { Subjects } from './subjects';
import { OrderStatus } from './types/order-status';
export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string;
        userId: string;
        expiresAt: string;
        status: OrderStatus;
        version: number;
        ticket: {
            id: string;
            price: number;
        };
    };
}
