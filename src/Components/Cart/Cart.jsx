import React from "react";
import {
  FaMinus,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const Cart = ({
  activePanel,
  handleClose,
  cart,
  removeItem,
  quantityIncrement,
  quantityDecrement,
  subTotal,
  orderTotal,
  shippingFee,
  setOrderSummary,
}) => {
  const isCartEmpty = cart.length === 0;

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-zinc-100 border-l border-zinc-300 z-50 flex flex-col transform transition-transform duration-300 ${
        activePanel === "cart"
          ? "translate-x-0"
          : "translate-x-full"
      }`}
    >
      {/* Header */}

      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-300">
        <h2 className="text-3xl font-bold">
          Your Cart
        </h2>

        <button
          onClick={handleClose}
          className="font-semibold text-sm hover:text-red-500"
        >
          CLOSE
        </button>
      </div>

      {/* Cart Items */}

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {isCartEmpty ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-zinc-500">
                Cart Is Empty
              </h3>

              <p className="text-zinc-400 mt-2">
                Add products to continue
              </p>
            </div>
          </div>
        ) : (
          cart.map((product, index) => (
            <div
              key={product.id || index}
              className={`flex gap-4 p-5 border-b border-zinc-200 ${
                index % 2 === 0
                  ? "bg-white"
                  : "bg-blue-50"
              }`}
            >
              {/* Product Image */}

              <div className="w-24 h-24 bg-white rounded-lg border p-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Product Info */}

              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-bold text-zinc-800">
                    {product.name}
                  </h4>

                  <button
                    onClick={() =>
                      removeItem(product)
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="mt-2">
                  {product.onSale && (
                    <span className="block text-xs text-zinc-400 line-through">
                      ₹
                      {product.oldPrice.toFixed(
                        2
                      )}
                    </span>
                  )}

                  <span className="font-bold text-lg">
                    ₹
                    {product.price.toFixed(
                      2
                    )}
                  </span>
                </div>

                {/* Quantity */}

                <div className="mt-3 flex items-center gap-3">

                  <button
                    onClick={() =>
                      quantityDecrement(product)
                    }
                    className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:bg-zinc-100"
                  >
                    <FaMinus size={10} />
                  </button>

                  <span className="font-bold min-w-[20px] text-center">
                    {product.quantity}
                  </span>

                  <button
                    onClick={() =>
                      quantityIncrement(product)
                    }
                    className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:bg-zinc-100"
                  >
                    <FaPlus size={10} />
                  </button>

                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}

      <div className="border-t border-zinc-300 p-6">

        <div className="flex justify-between mb-2 text-zinc-600">
          <span>Subtotal</span>
          <span>
            ₹{subTotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between mb-2 text-zinc-600">
          <span>Shipping Fee</span>
          <span>
            ₹{shippingFee.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between border-t pt-4 mt-4">
          <span className="font-bold text-lg">
            Order Total
          </span>

          <span className="font-bold text-lg text-blue-600">
            ₹{orderTotal.toFixed(2)}
          </span>
        </div>

        <button
          disabled={isCartEmpty}
          onClick={() =>
            setOrderSummary(true)
          }
          className={`w-full mt-6 py-4 rounded-xl font-bold transition-all ${
            isCartEmpty
              ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Checkout
        </button>

      </div>
    </div>
  );
};

export default Cart;