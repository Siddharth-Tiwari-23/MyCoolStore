import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar/Navbar'
import Banner from '../Banner/Banner'
import Products from '../Products/Product'
import Cart from '../Cart/Cart'
import Wishlist from '../Wishlist/Wishlist'
import OrderSummary from '../OrderSummary/OrderSummary'
import OrderPlace from '../OrderPlace/OrderPlace'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [cart, setCart] = useState(() => {
    const storeCart = localStorage.getItem('cart');
    return storeCart ? JSON.parse(storeCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const storeWishlist = localStorage.getItem('wishlist');
    return storeWishlist ? JSON.parse(storeWishlist) : [];
  });

  const subTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const shippingFee = totalItems > 0 ? totalItems * 2 : 0;
  const orderTotal = subTotal + shippingFee;

  useEffect(() => {
    const changeNavbar = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', changeNavbar);
    return () => window.removeEventListener('scroll', changeNavbar);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [cart, wishlist]);

  const handleScroll = () => {
    const section = document.getElementById('product-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePanel = (tabName) => {
    setActivePanel(prev => (prev === tabName ? null : tabName));
  };

  const handleClose = () => setActivePanel(null);

  const removeItem = (product) => {
    setCart(prev => prev.filter(item => item.id !== product.id));
  };

  const quantityIncrement = (product) => {
    setCart(prev => prev.map(item =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const quantityDecrement = (product) => {
    setCart(prev => prev.map(item =>
      item.id === product.id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const addToCart = (product) => {
    const alreadyAdded = cart.find(item => item.id === product.id);
    if (alreadyAdded) {
      alert('Item is already in the cart');
      return;
    }
    setCart(prev => [...prev, { ...product, quantity: 1 }]);
  };

  const addToWishlist = (product) => {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    if (isInWishlist) {
      setWishlist(prev => prev.filter(item => item.id !== product.id));
    } else {
      const addedDate = new Date().toLocaleDateString('en-GB');
      setWishlist(prev => [...prev, { ...product, addedDate }]);
    }
  };

  const clearWishlist = () => setWishlist([]);

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
        <OrderPlace setOrderPlaced={setOrderPlaced} />
      )}
    </>
  );
};

export default Home;