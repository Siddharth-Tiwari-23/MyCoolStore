import React, { useEffect, useState } from "react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://mycoolstore.onrender.com/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-28 p-5">
      <h1 className="text-4xl font-bold mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p>No Orders Found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-xl p-5 mb-5 shadow"
          >
            <div className="flex justify-between">
              <h2 className="font-bold">
                Order ID:
              </h2>

              <span className="text-blue-600">
                {order.orderStatus}
              </span>
            </div>

            <p className="mt-2">
              Total: ₹{order.totalAmount}
            </p>

            <div className="mt-4">
              {order.products.map(
                (product, index) => (
                  <div
                    key={index}
                    className="border-b py-2"
                  >
                    {product.name} ×{" "}
                    {product.quantity}
                  </div>
                )
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
