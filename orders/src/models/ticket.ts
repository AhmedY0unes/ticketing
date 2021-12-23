import mongoose from 'mongoose';
import { Order, OrderStatus } from './orders';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
// import {OrderStatus} from '@ay-ms-pain/common'
// interface Ticket {

// }

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
  version: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByIdAndPreviousVersion(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret['_id'];
        return ret;
      },
    },
  }
);
ticketSchema.set('versionKey', 'version'); // __v => version
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByIdAndPreviousVersion = (event: {
  id: string;
  version: number;
}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};
// if we use an => func it's gonna corrupt the 'this' keyword inside the function.
// also mongoDB is using the old way of using JS.

// Run query to look at all orders.  Find and order where the ticket is the ticket we just found *and* cancelled.
// if we find an order from this Find, that means this ticket *is* reserved
// Claculate an expiration date for this order
ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isreserved' on.
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
