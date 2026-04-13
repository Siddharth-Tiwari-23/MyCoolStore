import React, { useState, useMemo } from "react";
import { products } from './ProductList';
import { GoHeartFill } from "react-icons/go";

const Products = ({ searchTerm, addToCart, addToWishlist, wishlist }) => {
  const categories = ["All", "Men", "Women", "Kids", "New Arrivals", "On Sale"];
  const [activeTab, setActiveTab] = useState('All');

  // useMemo prevents recalculating the filter on every single render
  const filteredItems = useMemo(() => {
    return products.filter(item => {
      const matchesCategory =
        activeTab === 'All' ||
        (activeTab === 'New Arrivals' && item.newArrival) ||
        (activeTab === 'On Sale' && item.onSale) ||
        activeTab === item.category;

      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchTerm]);

  return (
    <section id='product-section' className="max-w-[1300px] mx-auto px-6 md:px-12 py-10">
      {/* Category Tabs */}
      <div className="flex gap-3 justify-center items-center mt-8 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-6 py-2 rounded-full text-sm md:text-lg whitespace-nowrap transition-all duration-300
            ${activeTab === category ? 'bg-blue-600 text-white shadow-lg' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
            onClick={() => setActiveTab(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Listing Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12'>
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className='text-zinc-400 text-xl font-medium'>No Products Found matching "{searchTerm}"</p>
          </div>
        ) : (
          filteredItems.map(product => {
            const isFavorite = wishlist.some(item => item.id === product.id);
            
            return (
              <div key={product.id} className='group bg-white p-4 border border-zinc-200 rounded-2xl hover:shadow-xl transition-all duration-300 flex flex-col'>
                {/* Card Header */}
                <div className='flex justify-between items-start mb-4'>
                  <button
                    className={`text-2xl transition-transform active:scale-125 ${isFavorite ? 'text-red-500' : 'text-zinc-200 hover:text-zinc-300'}`}
                    onClick={() => addToWishlist(product)}
                  >
                    <GoHeartFill />
                  </button>

                  {(product.onSale || product.newArrival) && (
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md text-white ${product.onSale ? 'bg-red-500' : 'bg-blue-500'}`}>
                      {product.onSale ? 'Sale' : 'New'}
                    </span>
                  )}
                </div>

                {/* Product Image */}
                <div className='w-full h-48 mb-4 overflow-hidden rounded-xl bg-zinc-50'>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-500' 
                  />
                </div>

                {/* Product Details */}
                <div className='flex-1 flex flex-col justify-between text-center'>
                  <div>
                    <h3 className='text-lg font-bold text-zinc-800 line-clamp-1'>{product.name}</h3>
                    <div className="flex justify-center items-center gap-3 my-2">
                      {product.onSale && (
                        <span className='text-zinc-400 text-sm line-through'>₹{product.oldPrice.toFixed(2)}</span>
                      )}
                      <span className='text-zinc-900 font-black text-lg'>₹{product.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    className='mt-4 bg-zinc-900 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors active:scale-95'
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default Products;