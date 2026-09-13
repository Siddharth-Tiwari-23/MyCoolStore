import { useState } from "react";
import { API_BASE_URL } from "../../config";
import { createRazorpayOrder, verifyRazorpayPayment } from "../../services/orderService";

const OrderSummary = ({
  cart,
  subTotal,
  shippingFee,
  orderTotal,
  setOrderPlaced,
  setOrderSummary,
  setCart,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // "COD" or "Razorpay"
  const [statusMessage, setStatusMessage] = useState("");

  const handlePlaceOrder = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      setStatusMessage("");
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to complete your order.");
        return;
      }

      let razorpayPaymentId = null;
      let razorpayOrderId = null;

      // Online Payment Flow (Razorpay / Test Sandbox)
      if (paymentMethod === "Razorpay") {
        setStatusMessage("Initiating secure Razorpay checkout...");
        const rzpOrder = await createRazorpayOrder(orderTotal);

        if (!rzpOrder.success) {
          throw new Error(rzpOrder.message || "Failed to initialize payment gateway");
        }

        razorpayOrderId = rzpOrder.orderId;

        // Check if Razorpay script is present, otherwise run demo sandbox verification
        if (window.Razorpay && !rzpOrder.isDemoMode) {
          const paymentResult = await new Promise((resolve, reject) => {
            const options = {
              key: rzpOrder.keyId,
              amount: rzpOrder.amount,
              currency: rzpOrder.currency || "INR",
              name: "MyCoolStore",
              description: "Order Payment",
              order_id: rzpOrder.orderId,
              handler: (res) => resolve(res),
              modal: {
                ondismiss: () => reject(new Error("Payment cancelled by user")),
              },
              theme: { color: "#2563eb" },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
          });

          // Cryptographic verification
          setStatusMessage("Verifying cryptographic payment signature...");
          const verifyRes = await verifyRazorpayPayment(paymentResult);
          if (!verifyRes.success) {
            throw new Error("Payment signature verification failed");
          }
          razorpayPaymentId = paymentResult.razorpay_payment_id;
        } else {
          // Sandbox / Interview Demo Mock Payment
          const confirmPayment = window.confirm(
            `[Razorpay Test Gateway Sandbox]\nAmount: ₹${orderTotal}\nOrder ID: ${razorpayOrderId}\n\nClick OK to simulate successful payment authorization.`
          );
          if (!confirmPayment) {
            throw new Error("Payment cancelled in sandbox");
          }
          razorpayPaymentId = `pay_mock_${Date.now()}`;
        }
      }

      setStatusMessage("Placing order & verifying inventory...");
      const products = cart.map((item) => ({
        productId: String(item.id),
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const response = await fetch(`${API_BASE_URL}/api/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products,
          paymentMethod,
          razorpayOrderId,
          razorpayPaymentId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderSummary(false);
        setOrderPlaced(true);
        setCart([]);
        localStorage.removeItem("cart");
      } else {
        alert(data.message || "Unable to place order.");
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Order placement failed.");
    } finally {
      setSubmitting(false);
      setStatusMessage("");
    }
  };

  return (
    <section className="flex justify-center items-center bg-black/80 backdrop-blur-sm fixed inset-0 z-50 px-4">
      <div className="bg-white p-6 md:p-8 w-full max-w-[550px] rounded-2xl shadow-2xl border border-zinc-200">
        <h2 className="text-2xl md:text-3xl text-zinc-900 font-black mb-4 text-center tracking-tight">
          Confirm Your Order
        </h2>

        {/* Cart Items List */}
        <div className="max-h-[28vh] overflow-y-auto pr-2 border-b border-zinc-100">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-2.5 border-b border-zinc-50"
            >
              <div>
                <span className="font-semibold text-sm text-zinc-800">
                  {item.name}
                </span>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} × ₹{item.price}
                </p>
              </div>
              <span className="text-sm font-bold text-zinc-900">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Payment Method Selector */}
        <div className="mt-5">
          <label className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-2 block">
            Select Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("COD")}
              className={`p-3 rounded-xl border text-left transition ${
                paymentMethod === "COD"
                  ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-100"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">💵</span>
                <div>
                  <p className="text-sm font-bold text-gray-800">Cash on Delivery</p>
                  <p className="text-[11px] text-gray-500">Pay when delivered</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("Razorpay")}
              className={`p-3 rounded-xl border text-left transition ${
                paymentMethod === "Razorpay"
                  ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-100"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">💳</span>
                <div>
                  <p className="text-sm font-bold text-gray-800">Razorpay Online</p>
                  <p className="text-[11px] text-gray-500">UPI / Cards / NetBanking</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-5 space-y-2 pt-3 border-t text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Sub Total</span>
            <span>₹{subTotal}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Shipping Fee</span>
            <span>₹{shippingFee}</span>
          </div>

          <div className="flex justify-between font-extrabold text-lg border-t pt-3 text-zinc-900">
            <span>Total Payable</span>
            <span className="text-blue-600">₹{orderTotal}</span>
          </div>
        </div>

        {statusMessage && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2 text-center mt-3 animate-pulse">
            {statusMessage}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setOrderSummary(false)}
            disabled={submitting}
            className="flex-1 py-3 border border-gray-300 font-semibold text-gray-700 rounded-xl hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 font-bold text-white rounded-xl transition shadow-lg disabled:opacity-50"
          >
            {submitting ? "Processing..." : paymentMethod === "Razorpay" ? "Pay & Confirm" : "Place Order (COD)"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrderSummary;
