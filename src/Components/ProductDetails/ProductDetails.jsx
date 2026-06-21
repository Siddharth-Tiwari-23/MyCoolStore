import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "../Products/ProductList";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <div className="text-center mt-20 text-2xl">
        Product Not Found
      </div>
    );
  }

  const handleAddToCart = () => {
    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const alreadyExists = existingCart.find(
      (item) => item.id === product.id
    );

    if (alreadyExists) {
      alert("Product already in cart");
      return;
    }

    existingCart.push({
      ...product,
      quantity: 1,
    });

    localStorage.setItem(
      "cart",
      JSON.stringify(existingCart)
    );

    alert("Added To Cart");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">

        <button
          onClick={() => navigate(-1)}
          className="mb-8 border px-5 py-2 rounded-lg hover:bg-gray-100"
        >
          ← Back
        </button>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Product Image */}
          <div className="bg-gray-100 rounded-2xl p-8">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[500px] object-contain"
            />
          </div>

          {/* Product Info */}
          <div>

            <h1 className="text-4xl font-bold">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mt-5">

              {product.onSale && (
                <span className="text-gray-400 line-through text-xl">
                  ₹{product.oldPrice}
                </span>
              )}

              <span className="text-3xl font-bold text-blue-600">
                ₹{product.price}
              </span>

            </div>

            <p className="mt-8 text-gray-600 leading-7">
              Premium quality product from MyCoolStore.
              Designed for comfort, style and
              everyday use.
            </p>

            {/* Sizes */}
            <div className="mt-8">

              <h3 className="font-semibold mb-3">
                Select Size
              </h3>

              <div className="flex gap-3">

                <button className="border px-5 py-2 rounded-lg hover:bg-black hover:text-white">
                  S
                </button>

                <button className="border px-5 py-2 rounded-lg hover:bg-black hover:text-white">
                  M
                </button>

                <button className="border px-5 py-2 rounded-lg hover:bg-black hover:text-white">
                  L
                </button>

                <button className="border px-5 py-2 rounded-lg hover:bg-black hover:text-white">
                  XL
                </button>

              </div>

            </div>

            {/* Category */}
            <div className="mt-8">
              <span className="font-semibold">
                Category:
              </span>{" "}
              {product.category}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-10">

              <button
                onClick={handleAddToCart}
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-blue-600"
              >
                Add To Cart
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="border px-8 py-3 rounded-lg hover:bg-gray-100"
              >
                Continue Shopping
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;