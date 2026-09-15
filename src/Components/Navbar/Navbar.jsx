import React, { useState } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const Navbar = ({
  handleScroll,
  setSearchTerm,
  isScrolled,
  handlePanel,
  totalItems,
  wishlist
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    currentUser = null;
  }
  const userName = currentUser?.name || "Guest";
  const isAdmin = currentUser?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const scrollToSection = () => {
    handleScroll();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 px-6 py-4 flex items-center justify-between ${
          isScrolled
            ? "bg-white shadow-md"
            : "bg-white/90 backdrop-blur-md text-zinc-800"
        }`}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            navigate("/");
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          <h1 className="text-2xl font-black uppercase tracking-tighter text-blue-600">
            MyCoolStore
            <span className="text-zinc-800">.</span>
          </h1>
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm uppercase tracking-wide">
          <button
            onClick={scrollToSection}
            className="hover:text-blue-600 transition-colors"
          >
            Products
          </button>

          <button
            onClick={scrollToSection}
            className="hover:text-blue-600 transition-colors"
          >
            Categories
          </button>

          <button
            onClick={scrollToSection}
            className="hover:text-blue-600 transition-colors"
          >
            Deals
          </button>
        </div>

        {/* Search */}
        <div className="relative hidden md:block w-[200px] lg:w-[280px]">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-zinc-100 border-none rounded-full py-2 px-5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {token ? (
            <>
              <span className="hidden sm:inline font-semibold text-sm">
                Hi, {userName}
              </span>

              {/* Orders */}
              <button
                onClick={() => navigate("/orders")}
                className="hidden sm:inline font-semibold text-sm hover:text-blue-600 transition-colors"
              >
                My Orders
              </button>

              {isAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-600 transition shadow-sm"
                >
                  Admin Portal
                </button>
              )}

              {/* Wishlist */}
              <button
                className="relative cursor-pointer hover:text-red-500 transition-colors"
                onClick={() => handlePanel("wishlist")}
                aria-label="Wishlist"
              >
                <FaHeart size={20} />

                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                className="relative cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => handlePanel("cart")}
                aria-label="Cart"
              >
                <FaShoppingCart size={20} />

                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="hidden sm:inline font-semibold text-sm hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-sm hover:text-blue-600 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-zinc-700 hover:text-black"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[65px] bg-white border-b shadow-lg z-30 p-6 flex flex-col gap-4 md:hidden">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-zinc-100 rounded-full py-2 px-4 text-sm outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            onClick={scrollToSection}
            className="text-left font-semibold py-2 border-b"
          >
            Browse Products & Deals
          </button>

          {token ? (
            <>
              <button
                onClick={() => {
                  navigate("/orders");
                  setMobileMenuOpen(false);
                }}
                className="text-left font-semibold py-2 border-b"
              >
                My Orders
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    navigate("/admin");
                    setMobileMenuOpen(false);
                  }}
                  className="text-left font-semibold text-slate-800 py-2 border-b flex items-center justify-between"
                >
                  <span>Admin Portal</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Staff</span>
                </button>
              )}
              <button
                onClick={() => {
                  handlePanel("wishlist");
                  setMobileMenuOpen(false);
                }}
                className="text-left font-semibold py-2 border-b"
              >
                Wishlist ({wishlist.length})
              </button>
              <button
                onClick={() => {
                  handlePanel("cart");
                  setMobileMenuOpen(false);
                }}
                className="text-left font-semibold py-2 border-b"
              >
                Cart ({totalItems})
              </button>
              <button
                onClick={handleLogout}
                className="text-left font-semibold text-red-500 py-2"
              >
                Logout ({userName})
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 font-semibold border rounded-lg"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 bg-blue-600 text-white rounded-lg font-semibold"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;