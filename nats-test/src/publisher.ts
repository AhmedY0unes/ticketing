import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    //to wait for the publish it execute successfuly before running in other code.
    await publisher.publish({
      id: '123',
      title: 'Hello',
      price: 20,
      userId: '11225sa',
    });
  } catch (err) {
    console.error(err);
  }
  // const data = JSON.stringify({
  //   id: '122',
  //   title: 'concert',
  //   price: 20,
  // });

  // stan.publish('ticket:created', data, () => {
  //   console.log('event published');
  // });
});
