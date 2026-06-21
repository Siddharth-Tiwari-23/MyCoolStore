import React, { useState, useMemo } from "react";
import { products } from "./ProductList";
import { GoHeartFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const Products = ({
  searchTerm,
  addToCart,
  addToWishlist,
  wishlist,
}) => {
  const navigate = useNavigate();

  const categories = [
    "All",
    "Men",
    "Women",
    "Kids",
    "New Arrivals",
    "On Sale",
  ];

  const [activeTab, setActiveTab] = useState("All");

  const filteredItems = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        activeTab === "All" ||
        (activeTab === "New Arrivals" &&
          item.newArrival) ||
        (activeTab === "On Sale" &&
          item.onSale) ||
        activeTab === item.category;

      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchTerm]);

  return (
    <section
      id="product-section"
      className="max-w-[1300px] mx-auto px-6 md:px-12 py-10"
    >
      {/* Categories */}

      <div className="flex gap-3 justify-center items-center mt-8 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() =>
              setActiveTab(category)
            }
            className={`px-6 py-2 rounded-full text-sm md:text-lg whitespace-nowrap transition-all duration-300
            ${
              activeTab === category
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-zinc-400 text-xl font-medium">
              No Products Found matching "
              {searchTerm}"
            </p>
          </div>
        ) : (
          filteredItems.map((product) => {
            const isFavorite =
              wishlist.some(
                (item) =>
                  item.id === product.id
              );

            return (
              <div
                key={product.id}
                className="group bg-white p-4 border border-zinc-200 rounded-2xl hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Top */}

                <div className="flex justify-between items-start mb-4">
                  <button
                    className={`text-2xl transition-transform active:scale-125 ${
                      isFavorite
                        ? "text-red-500"
                        : "text-zinc-200 hover:text-zinc-300"
                    }`}
                    onClick={() =>
                      addToWishlist(product)
                    }
                  >
                    <GoHeartFill />
                  </button>

                  {(product.onSale ||
                    product.newArrival) && (
                    <span
                      className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md text-white ${
                        product.onSale
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {product.onSale
                        ? "Sale"
                        : "New"}
                    </span>
                  )}
                </div>

                {/* Image */}

                <div
                  className="w-full h-48 mb-4 overflow-hidden rounded-xl bg-zinc-50 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/product/${product.id}`
                    )
                  }
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Details */}

                <div className="flex-1 flex flex-col justify-between text-center">
                  <div>
                    <h3
                      className="text-lg font-bold text-zinc-800 line-clamp-1 cursor-pointer hover:text-blue-600"
                      onClick={() =>
                        navigate(
                          `/product/${product.id}`
                        )
                      }
                    >
                      {product.name}
                    </h3>

                    <div className="flex justify-center items-center gap-3 my-2">
                      {product.onSale && (
                        <span className="text-zinc-400 text-sm line-through">
                          ₹
                          {product.oldPrice.toFixed(
                            2
                          )}
                        </span>
                      )}

                      <span className="text-zinc-900 font-black text-lg">
                        ₹
                        {product.price.toFixed(
                          2
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      className="bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
                      onClick={() =>
                        navigate(
                          `/product/${product.id}`
                        )
                      }
                    >
                      View Details
                    </button>

                    <button
                      className="bg-zinc-900 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors active:scale-95"
                      onClick={() =>
                        addToCart(product)
                      }
                    >
                      Add To Cart
                    </button>
                  </div>
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