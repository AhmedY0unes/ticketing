import Router from 'next/router';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push('/orders'),
  });
  // the [] is to make sure the func runs only one time when the component first shown on the screen
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);
  // we might get a warning, since we are refrenceing a dependencyy (order) inside without listing it in the []
  if (timeLeft < 0) {
    return <span className="text-justify bg-warning">ORDER HAS EXPIRED</span>;
  }

  return (
    <div className="">
      Time left to pay for your sins: {timeLeft}
      <span className="spinner-border spinner-border-sm"></span>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51K99H1AjPRb2YfVbLQCYXa0oFnC2SSNKWtJB0RdWPRusHG8VdgpaCoo0NZKj8MxDCBUzA8dcn3QF1gkXwBHnkEeb00On6wLWgk"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

// we use getInitialprops to fethch the order
OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};
export default OrderShow;
