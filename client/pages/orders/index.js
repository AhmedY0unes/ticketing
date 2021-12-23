const OrderIndex = ({ orders }) => {
  return (
    <table className="table table-striped">
      <thead className="table">
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Expires At</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          return (
            <tr key={order.id}>
              <td>{order.ticket.title}</td>
              <td>{order.status}</td>
              <td>
                {Date(new Date(order.expiresAt) - new Date()).slice(0, 31)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default OrderIndex;
