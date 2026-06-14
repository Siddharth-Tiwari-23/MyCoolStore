import React from 'react';
import {
    FaSearch,
    FaShoppingCart,
    FaHeart,
    FaBars
} from 'react-icons/fa';

const Navbar = ({
    handleScroll,
    setSearchTerm,
    isScrolled,
    handlePanel,
    totalItems,
    wishlist
}) => {

    // Get logged in user from localStorage
    const user =
        JSON.parse(localStorage.getItem("user")) || {};

    const userName = user.name || "User";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 px-6 py-4 flex items-center justify-between ${
                isScrolled
                    ? 'bg-white shadow-md'
                    : 'bg-transparent text-zinc-800'
            }`}
        >

            {/* Logo */}
            <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() =>
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                }
            >
                <h1 className="text-2xl font-black uppercase tracking-tighter text-blue-600">
                    MyCoolStore
                    <span className="text-zinc-800">.</span>
                </h1>
            </div>

            {/* Middle Menu */}
            <div className="hidden md:flex items-center gap-8 font-semibold text-sm uppercase tracking-wide">

                <button
                    onClick={handleScroll}
                    className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                    Products
                </button>

                <button
                    className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                    Categories
                </button>

                <button
                    className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                    Deals
                </button>

            </div>

            {/* Search */}
            <div className="relative hidden lg:block w-[200px] xl:w-[300px]">

                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-zinc-100 border-none rounded-full py-2 px-5 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                />

                <FaSearch
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />

            </div>

            {/* Right Section */}
            <div className="flex items-center gap-5">

                {/* Logged in user */}
                <span className="font-semibold">
                    Hi, {userName}
                </span>

                {/* Wishlist */}
                <button
                    className="relative cursor-pointer hover:text-red-500 transition-colors"
                    onClick={() => handlePanel('wishlist')}
                >
                    <FaHeart size={22} />

                    {wishlist.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            {wishlist.length}
                        </span>
                    )}
                </button>

                {/* Cart */}
                <button
                    className="relative cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handlePanel('cart')}
                >
                    <FaShoppingCart size={22} />

                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            {totalItems}
                        </span>
                    )}
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="font-semibold hover:text-red-500 transition-colors"
                >
                    Logout
                </button>

                {/* Mobile Menu */}
                <button className="md:hidden">
                    <FaBars size={22} />
                </button>

            </div>

        </nav>
    );
};

export default Navbar;