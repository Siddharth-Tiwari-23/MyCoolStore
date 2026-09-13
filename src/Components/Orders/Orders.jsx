import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const TRACKING_STEPS = [
  { key: "Placed", label: "Order Placed", icon: "📝" },
  { key: "Processing", label: "Processing", icon: "⚙️" },
  { key: "Shipped", label: "Shipped", icon: "🚚" },
  { key: "Delivered", label: "Delivered", icon: "🎉" },
];

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

  const getStepIndex = (status) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Processing":
        return 1;
      case "Shipped":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Processing":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 border bg-white px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition shadow-sm"
          >
            ← Back to Store
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-slate-900">My Orders & Tracking</h1>
            <p className="text-sm text-slate-500 mt-1">Live order state machine & tracking</p>
          </div>
          <button
            onClick={fetchOrders}
            className="border bg-white px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 shadow-sm"
            title="Refresh order statuses"
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-200">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-500 font-medium">Loading your orders & live tracking...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-700">No Orders Yet</h2>
            <p className="text-slate-500 mt-2 mb-6">Discover our curated products and place your first order!</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          orders.map((order) => {
            const currentStep = getStepIndex(order.orderStatus);
            const isCancelled = order.orderStatus === "Cancelled";

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8 transition hover:shadow-md"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-slate-100 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Order ID</span>
                      <span className="text-sm font-mono font-bold text-blue-600">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 font-semibold text-slate-600">
                      {order.paymentMethod || "COD"} • {order.paymentStatus || "Pending"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Tracking Stepper Progress Bar */}
                <div className="my-8 px-2">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-6">
                    Live Tracking Status
                  </h4>

                  {isCancelled ? (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center text-rose-700 font-semibold">
                      This order has been cancelled.
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Background Bar */}
                      <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0"></div>
                      {/* Active Progress Fill */}
                      <div
                        className="absolute top-5 left-8 h-1 bg-blue-600 transition-all duration-500 -z-0"
                        style={{
                          width: `${(currentStep / (TRACKING_STEPS.length - 1)) * 82}%`,
                        }}
                      ></div>

                      {/* Stepper Nodes */}
                      <div className="flex justify-between relative z-10">
                        {TRACKING_STEPS.map((step, idx) => {
                          const isCompleted = idx <= currentStep;
                          const isCurrent = idx === currentStep;

                          return (
                            <div key={step.key} className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold transition-all duration-300 shadow-sm ${
                                  isCompleted
                                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                    : "bg-white border-2 border-slate-300 text-slate-400"
                                }`}
                              >
                                {isCompleted ? (isCurrent ? step.icon : "✓") : step.icon}
                              </div>
                              <span
                                className={`mt-2 text-xs font-semibold text-center ${
                                  isCompleted ? "text-slate-900" : "text-slate-400"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Items & Amount Summary */}
                <div className="border-t border-slate-100 pt-5 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-slate-800">Purchased Items ({order.products?.length})</h4>
                    <span className="text-lg font-extrabold text-slate-900">
                      Total: <span className="text-blue-600">₹{order.totalAmount}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.products.map((item) => (
                      <div
                        key={`${order._id}-${item.productId}`}
                        className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-contain bg-white border border-slate-200"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                          <p className="text-xs text-slate-500">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
