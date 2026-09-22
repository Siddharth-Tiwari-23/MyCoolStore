import { useState } from "react";
import { API_BASE_URL } from "../../config";
import { createRazorpayOrder, verifyRazorpayPayment } from "../../services/orderService";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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

  const completeOrderPlacement = async ({
    razorpayOrderId = null,
    razorpayPaymentId = null,
    razorpaySignature = null,
  }) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to complete your order.");
        return;
      }

      if (paymentMethod === "Razorpay" && razorpayPaymentId) {
        setStatusMessage("Verifying payment confirmation...");
        const verifyRes = await verifyRazorpayPayment({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        });

        if (!verifyRes.success) {
          throw new Error(verifyRes.message || "Payment verification failed");
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
          razorpaySignature,
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

  const handlePlaceOrder = async () => {
    if (submitting) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to complete your order.");
        return;
      }

      // COD flow
      if (paymentMethod === "COD") {
        await completeOrderPlacement({
          razorpayOrderId: null,
          razorpayPaymentId: null,
          razorpaySignature: null,
        });
        return;
      }

      // Online Razorpay Flow
      setSubmitting(true);
      setStatusMessage("Connecting to secure Razorpay portal...");
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        throw new Error("Unable to load Razorpay SDK. Please check your internet connection.");
      }

      const productsPayload = cart.map((item) => ({
        productId: String(item.id),
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const rzpOrder = await createRazorpayOrder(productsPayload);
      if (!rzpOrder.success || !rzpOrder.keyId) {
        throw new Error(rzpOrder.message || "Failed to initialize payment gateway");
      }

      const options = {
        key: rzpOrder.keyId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || "INR",
        name: "MyCoolStore",
        description: "Order Checkout",
        image: "/logo.png",
        order_id: rzpOrder.orderId,
        handler: async (response) => {
          setStatusMessage("Payment authorized! Finalizing order...");
          await completeOrderPlacement({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            setStatusMessage("");
          },
        },
        prefill: {
          name: localStorage.getItem("userName") || "Customer",
          email: localStorage.getItem("userEmail") || "customer@example.com",
          contact: "9876543210",
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setSubmitting(false);
        setStatusMessage("");
        alert(response?.error?.description || "Payment failed");
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert(error.message || "Payment process interrupted.");
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
