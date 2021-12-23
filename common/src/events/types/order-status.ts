export enum OrderStatus {
  // When the order has been created, but the ticket it's trying to order hasn't been reserved
  Created = 'created',

  // the ticket the order is trying to reserve has already
  // been reserved, ot when the user has cancelled the order
  // or The order expires before payment
  Cancelled = 'cancelled',

  // The order has successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',

  //The order has reserved the ticket and the user has provided payment successfully
  Complete = 'complete',
}
