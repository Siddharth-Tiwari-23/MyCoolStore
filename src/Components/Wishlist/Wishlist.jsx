import React from "react";

const Wishlist = ({ activePanel, handleClose, wishlist, addToCart, clearWishlist }) => {
  const isWishlistEmpty = wishlist.length === 0;

  return (
    <div
      className={`flex flex-col justify-between gap-5 bg-zinc-100 fixed top-0 right-0 bottom-0 left-auto w-full sm:w-[480px] border-l z-50 border-zinc-300 py-7 transform transition-transform duration-300
      ${activePanel === "wishlist" ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="px-10 flex justify-between items-center">
        <h3 className="text-3xl font-bold text-zinc-800">Your Wishlist</h3>
        <button onClick={handleClose} className="text-zinc-500 hover:text-zinc-800 text-sm font-semibold">
          CLOSE
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar">
        {isWishlistEmpty ? (
          <div className="flex flex-col items-center justify-center h-full opacity-60">
             <p className='text-zinc-800 text-center text-lg'>Your Wishlist is Empty</p>
          </div>
        ) : (
          wishlist.map((product, index) => (
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
                  <p className='text-[10px] uppercase font-bold text-zinc-400'>Added: {product.addedDate}</p>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div>
                    {product.onSale && (
                      <span className="text-zinc-400 text-xs line-through mr-2">
                        ₹{product.oldPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-red-600 font-bold text-md">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <button 
                    className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-md font-semibold" 
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex px-5 gap-3">
        <button
          className="flex-1 py-4 bg-zinc-200 text-zinc-700 font-bold rounded-xl hover:bg-zinc-300 transition-colors"
          onClick={handleClose}
        >
          Close
        </button>
        <button 
          className={`flex-1 py-4 font-bold rounded-xl transition-all
          ${isWishlistEmpty ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-100'}`}
          onClick={clearWishlist}
          disabled={isWishlistEmpty}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default Wishlist;