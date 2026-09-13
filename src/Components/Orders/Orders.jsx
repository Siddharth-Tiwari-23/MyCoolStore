import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Processing":
        return "bg-blue-100 text-blue-700";

      case "Shipped":
        return "bg-purple-100 text-purple-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 border bg-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition shadow-sm"
          >
            ← Back to Store
          </button>
          <h1 className="text-3xl font-bold text-center">
            My Orders
          </h1>
          <div className="w-28" />
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-600">
              No Orders Yet
            </h2>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-md p-6 mb-6"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b pb-4">

                <div>
                  <h2 className="font-bold text-lg">
                    Order ID
                  </h2>

                  <p className="text-gray-500 text-sm break-all">
                    {order._id}
                  </p>
                </div>

                <div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Order Info */}
              <div className="flex flex-col md:flex-row md:justify-between mt-4 gap-3">

                <div>
                  <p className="text-gray-500 text-sm">
                    Order Date
                  </p>

                  <p className="font-semibold">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Total Amount
                  </p>

                  <p className="font-bold text-blue-600 text-lg">
                    ₹{order.totalAmount}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div className="mt-6">

                <h3 className="font-bold text-lg mb-3">
                  Products
                </h3>

                <div className="space-y-3">
                  {order.products.map((item) => (
                    <div
                      key={`${order._id}-${item.productId}`}
                      className="flex justify-between items-center border rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium">
                          {item.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <div className="font-semibold text-blue-600">
                        ₹{item.price}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
