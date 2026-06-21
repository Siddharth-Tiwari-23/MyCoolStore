import toast from "react-hot-toast";
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
  removeCart,
} from "../../services/authService";

import { products } from "../Products/ProductList";

const Home = () => {
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
  // LOAD USER DATA FROM DB
  // ==========================
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await getProfile();

        if (!data.success) return;

        const dbWishlist = products.filter((product) =>
          data.user.wishlist?.includes(String(product.id))
        );

        const dbCart = data.user.cart
          ?.map((cartItem) => {
            const product = products.find(
              (p) => String(p.id) === cartItem.productId
            );

            if (!product) return null;

            return {
              ...product,
              quantity: cartItem.quantity,
            };
          })
          .filter(Boolean);

        setWishlist(dbWishlist || []);
        setCart(dbCart || []);
      } catch (error) {
        console.log(error);
      }
    };

    loadUserData();
  }, []);

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
    }
  };

  const removeItem = async (product) => {
    const response = await removeCart(product.id);

    if (response.success) {
      setCart((prev) =>
        prev.filter((item) => item.id !== product.id)
      );
    }
  };

  const quantityIncrement = (product) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const quantityDecrement = (product) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === product.id && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
    );
  };

  // ==========================
  // WISHLIST
  // ==========================
  const addToWishlist = async (product) => {
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