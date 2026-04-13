import React from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";

const Cart = ({ activePanel, handleClose, cart, removeItem, quantityIncrement, quantityDecrement, subTotal, orderTotal, shippingFee, setOrderSummary }) => {
  const isCartEmpty = cart.length === 0;

  return (
    <div
      className={`flex flex-col justify-between gap-5 bg-zinc-100 fixed top-0 right-0 bottom-0 left-auto w-full sm:w-[480px] border-l z-50 border-zinc-300 py-7 transform transition-transform duration-300
      ${activePanel === "cart" ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="px-10 flex justify-between items-center">
        <h3 className="text-3xl font-bold text-zinc-800">Your Cart</h3>
        <button onClick={handleClose} className="text-zinc-500 hover:text-zinc-800 text-sm font-semibold">
          CLOSE
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar">
        {isCartEmpty ? (
          <div className="flex flex-col items-center justify-center h-full opacity-60">
             <p className="text-zinc-800 text-center text-lg">Your Cart is empty</p>
          </div>
        ) : (
          cart.map((product, index) => (
            <div
              key={product.id || index}
              className={`flex items-center gap-4 px-5 py-3 border-y border-zinc-200
              ${index % 2 === 0 ? "bg-blue-50" : "bg-white"}`}
            >
              <div className="w-20 h-20 bg-white rounded-md p-1 border border-zinc-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-zinc-800 text-md line-clamp-1">
                    {product.name}
                  </h4>
                  <button
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                    onClick={() => removeItem(product)}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex flex-col">
                    {product.onSale && (
                      <span className="text-zinc-400 text-xs line-through">
                        ₹{product.oldPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-zinc-900 font-bold">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-zinc-200 rounded-full px-2 py-1">
                    <button 
                      className="w-6 h-6 bg-white rounded-full flex justify-center items-center text-zinc-600 hover:bg-blue-100 active:scale-90 transition-all"
                      onClick={() => quantityDecrement(product)}
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="font-medium text-sm min-w-[20px] text-center">{product.quantity}</span>
                    <button 
                      className="w-6 h-6 bg-white rounded-full flex justify-center items-center text-zinc-600 hover:bg-blue-100 active:scale-90 transition-all"
                      onClick={() => quantityIncrement(product)}
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-10 space-y-2 border-t border-zinc-300 pt-4">
        <div className="flex justify-between text-sm text-zinc-600">
          <span>SubTotal</span>
          <span>₹{subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-zinc-600">
          <span>Shipping Fee</span>
          <span>₹{shippingFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-4 border-t border-zinc-200">
          <span className="text-lg text-zinc-800 font-bold">Order Total</span>
          <span className="text-lg text-blue-600 font-bold">₹{orderTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex px-5 pb-2 gap-3">
        <button
          className={`flex-[2] py-4 rounded-xl font-bold transition-all shadow-lg
          ${isCartEmpty ? 'bg-zinc-300 cursor-not-allowed text-zinc-500' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
          disabled={isCartEmpty} 
          onClick={() => setOrderSummary(true)}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;