import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Banner from "../Banner/Banner";
import Products from "../Products/Product";
import Cart from "../Cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import OrderSummary from "../OrderSummary/OrderSummary";
import OrderPlace from "../OrderPlace/OrderPlace";
import ChatBot from "../ChatBot/ChatBot";

import {
  getProfile,
  addWishlist,
  removeWishlist,
  addCart,
  updateCartQuantity,
  removeCart,
} from "../../services/authService";
import { fetchProducts } from "../../services/productService";
import { products as fallbackProducts } from "../Products/ProductList";

const Home = () => {
  const [allProducts, setAllProducts] = useState(fallbackProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const subTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const shippingFee = totalItems > 0 ? totalItems * 2 : 0;
  const orderTotal = subTotal + shippingFee;

  // ==========================
  // FETCH DYNAMIC CATALOG
  // ==========================
  useEffect(() => {
    fetchProducts().then((res) => {
      if (res?.success && Array.isArray(res.products) && res.products.length > 0) {
        setAllProducts(res.products);
      }
    });
  }, []);

  // ==========================
  // LOAD USER DATA FROM DB
  // ==========================
  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");
    if (!token) return;

    getProfile().then((data) => {
      if (!isMounted || !data?.success || !data?.user) return;

      const dbWishlist = allProducts.filter((product) =>
        data.user.wishlist?.includes(String(product.id || product._id))
      );

      const dbCart = data.user.cart
        ?.map((cartItem) => {
          const product = allProducts.find(
            (p) => String(p.id || p._id) === String(cartItem.productId)
          );

          if (!product) return null;

          return {
            ...product,
            id: product.id || product._id,
            quantity: cartItem.quantity || 1,
          };
        })
        .filter(Boolean);

      setWishlist(dbWishlist || []);
      setCart(dbCart || []);
    }).catch((error) => {
      console.error("Error loading user data:", error);
    });

    return () => {
      isMounted = false;
    };
  }, [activePanel, allProducts]);

  // ==========================
  // NAVBAR SCROLL
  // ==========================
  useEffect(() => {
    const changeNavbar = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", changeNavbar);

    return () => {
      window.removeEventListener("scroll", changeNavbar);
    };
  }, []);

  const handleScroll = () => {
    const section = document.getElementById("product-section");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const handlePanel = (tabName) => {
    setActivePanel((prev) =>
      prev === tabName ? null : tabName
    );
  };

  const handleClose = () => {
    setActivePanel(null);
  };

  // ==========================
  // CART
  // ==========================
  const addToCart = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add items to your cart.");
      window.location.href = "/login";
      return;
    }

    const alreadyAdded = cart.find(
      (item) => item.id === product.id
    );

    if (alreadyAdded) {
      alert("Item already exists in cart");
      return;
    }

    const response = await addCart(product.id);

    if (response.success) {
      setCart((prev) => [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ]);
    } else {
      alert(response.message || "Failed to add to cart");
    }
  };

  const removeItem = async (product) => {
    const response = await removeCart(product.id);

    if (response.success) {
      setCart((prev) =>
        prev.filter((item) => item.id !== product.id)
      );
    } else {
      alert(response.message || "Failed to remove item");
    }
  };

  const quantityIncrement = async (product) => {
    const newQuantity = (product.quantity || 1) + 1;

    setCart((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )
    );

    const res = await updateCartQuantity(product.id, newQuantity);
    if (!res.success) {
      console.error("Failed to update cart quantity on server");
    }
  };

  const quantityDecrement = async (product) => {
    if (product.quantity <= 1) return;
    const newQuantity = product.quantity - 1;

    setCart((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )
    );

    const res = await updateCartQuantity(product.id, newQuantity);
    if (!res.success) {
      console.error("Failed to update cart quantity on server");
    }
  };

  // ==========================
  // WISHLIST
  // ==========================
  const addToWishlist = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to manage your wishlist.");
      window.location.href = "/login";
      return;
    }

    const exists = wishlist.some(
      (item) => item.id === product.id
    );

    if (exists) {
      const response = await removeWishlist(product.id);

      if (response.success) {
        setWishlist((prev) =>
          prev.filter(
            (item) => item.id !== product.id
          )
        );
      }
    } else {
      const response = await addWishlist(product.id);

      if (response.success) {
        setWishlist((prev) => [...prev, product]);
      }
    }
  };

  const clearWishlist = async () => {
    for (const item of wishlist) {
      await removeWishlist(item.id);
    }

    setWishlist([]);
  };

  return (
    <>
      <Navbar
        handleScroll={handleScroll}
        setSearchTerm={setSearchTerm}
        isScrolled={isScrolled}
        handlePanel={handlePanel}
        totalItems={totalItems}
        wishlist={wishlist}
      />

      <Banner />

      <Products
        products={allProducts}
        searchTerm={searchTerm}
        addToCart={addToCart}
        addToWishlist={addToWishlist}
        wishlist={wishlist}
      />

      <Cart
        activePanel={activePanel}
        handleClose={handleClose}
        cart={cart}
        removeItem={removeItem}
        quantityIncrement={quantityIncrement}
        quantityDecrement={quantityDecrement}
        subTotal={subTotal}
        shippingFee={shippingFee}
        orderTotal={orderTotal}
        setOrderSummary={setShowSummary}
      />

      <Wishlist
        activePanel={activePanel}
        handleClose={handleClose}
        wishlist={wishlist}
        addToCart={addToCart}
        clearWishlist={clearWishlist}
      />

      {showSummary && (
        <OrderSummary
          cart={cart}
          subTotal={subTotal}
          shippingFee={shippingFee}
          orderTotal={orderTotal}
          setOrderPlaced={setOrderPlaced}
          setOrderSummary={setShowSummary}
          setCart={setCart}
        />
      )}

      {orderPlaced && (
        <OrderPlace
          setOrderPlaced={setOrderPlaced}
        />
      )}
      <ChatBot />
    </>
  );
};

export default Home;