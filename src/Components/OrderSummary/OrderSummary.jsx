import React from "react";

const OrderSummary = ({
  cart,
  subTotal,
  shippingFee,
  orderTotal,
  setOrderPlaced,
  setOrderSummary,
  setCart,
}) => {

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const products = cart.map((item) => ({
        productId: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const response = await fetch(
        "https://mycoolstore.onrender.com/api/orders/place",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            products,
            totalAmount: orderTotal,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setOrderSummary(false);
        setOrderPlaced(true);

        setCart([]);

        localStorage.removeItem("cart");

        alert("Order Placed Successfully 🎉");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Order Failed");
    }
  };

  return (
    <section className="flex justify-center items-center bg-black/80 backdrop-blur-sm fixed inset-0 z-50 px-4">
      <div className="bg-white p-8 w-full max-w-[550px] rounded-2xl shadow-2xl border border-zinc-200">

        <h2 className="text-3xl text-zinc-900 font-black mb-6 text-center tracking-tight">
          Confirm Your Order
        </h2>

        <div className="max-h-[40vh] overflow-y-auto pr-2">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-3 border-b border-zinc-100"
            >
              <div>
                <span className="font-semibold">
                  {item.name}
                </span>

                <p className="text-sm text-gray-500">
                  Qty: {item.quantity} × ₹{item.price}
                </p>
              </div>

              <span>
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 pt-4 border-t">

          <div className="flex justify-between">
            <span>Sub Total</span>
            <span>₹{subTotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{shippingFee}</span>
          </div>

          <div className="flex justify-between font-bold text-xl border-t pt-4">
            <span>Total</span>
            <span>₹{orderTotal}</span>
          </div>

        </div>

        <div className="flex gap-4 mt-8">

          <button
            onClick={() => setOrderSummary(false)}
            className="flex-1 py-4 border rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={handlePlaceOrder}
            className="flex-1 py-4 bg-blue-600 text-white rounded-xl"
          >
            Confirm Order
          </button>

        </div>

      </div>
    </section>
  );
};

export default OrderSummary;
