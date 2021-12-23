import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });
  // Save the ticket to the database
  await ticket.save();
  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  // make two seperate changed to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });
  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket
  try {
    await secondInstance!.save();
    // secnod fetch won't work as expected sicne the version number
    // is outdated from the first fetch
  } catch (err) {
    return;
  }
  throw new Error("Shouldn't reach this point");
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
