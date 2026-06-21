import React from "react";
import { FaTrash, FaShoppingCart } from "react-icons/fa";

const Wishlist = ({
  activePanel,
  handleClose,
  wishlist,
  addToCart,
  clearWishlist,
}) => {
  const isWishlistEmpty = wishlist.length === 0;

  return (
    <div
      className={`flex flex-col bg-zinc-100 fixed top-0 right-0 bottom-0 left-auto w-full sm:w-[480px] border-l z-50 border-zinc-300 py-7 transform transition-transform duration-300
      ${
        activePanel === "wishlist"
          ? "translate-x-0"
          : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="px-10 flex justify-between items-center">
        <h3 className="text-3xl font-bold text-zinc-800">
          Wishlist
        </h3>

        <button
          onClick={handleClose}
          className="text-zinc-500 hover:text-zinc-800 text-sm font-semibold"
        >
          CLOSE
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar mt-5">
        {isWishlistEmpty ? (
          <div className="flex flex-col items-center justify-center h-full opacity-60">
            <p className="text-zinc-800 text-lg">
              Wishlist is empty
            </p>
          </div>
        ) : (
          wishlist.map((product, index) => (
            <div
              key={product.id || index}
              className={`flex items-center gap-4 px-5 py-3 border-y border-zinc-200
              ${
                index % 2 === 0
                  ? "bg-red-50"
                  : "bg-white"
              }`}
            >
              <div className="w-20 h-20 bg-white rounded-md p-1 border border-zinc-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-zinc-800">
                  {product.name}
                </h4>

                <div className="flex justify-between items-center mt-2">
                  <div>
                    {product.onSale && (
                      <span className="text-zinc-400 text-xs line-through block">
                        ₹
                        {product.oldPrice.toFixed(
                          2
                        )}
                      </span>
                    )}

                    <span className="font-bold text-zinc-900">
                      ₹
                      {product.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      addToCart(product)
                    }
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                  >
                    <FaShoppingCart />
                  </button>
                </div>

                {product.addedDate && (
                  <p className="text-xs text-zinc-500 mt-1">
                    Added: {product.addedDate}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {!isWishlistEmpty && (
        <div className="p-5 border-t border-zinc-300">
          <button
            onClick={clearWishlist}
            className="w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 flex items-center justify-center gap-2"
          >
            <FaTrash />
            Clear Wishlist
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;