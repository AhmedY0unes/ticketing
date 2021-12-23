import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      Router.push('/orders/[orderId]', `/orders/${order.id}`);
    },
  });
  // if we put () on he doRequest below it will invoke the func as soon as the code runs.
  return (
    <div className="card card-body ">
      <h1 className="card card-title">{ticket.title}</h1>
      <h4 className="card card-subtitle">Price: {ticket.price}</h4>
      {errors}

      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  // extract the id from the wildcard of the name of the file.
  const { ticketId } = context.query;

  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketShow;
