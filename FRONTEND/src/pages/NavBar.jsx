import React from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
import api from "../api/axios";

const NavBar = () => {
  const [cart, setCart] = useState(0);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return setCart(0);
    const fetchCart = async () => {
      try {
        const res = await api.get(`/cart/${userId}`);
        setCart(res.data.cart.items.reduce((s, i) => s + i.quantity, 0));
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    fetchCart();
    window.addEventListener("cartUpdated", fetchCart);
    return () => window.removeEventListener("cartUpdated", fetchCart);
  }, [userId]);

  const logout = () => {
    localStorage.clear();
    setCart(0);
    navigate("/");
  };

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-gray-800 tracking-tight"
          >
            Quick <span className="text-blue-500">Shop</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Auth buttons */}
            {userId ? (
              <>
                {/* Cart icon */}
                <Link
                  to="/cart"
                  className="relative flex items-center gap-1.5 text-gray-600 hover:text-blue-500 transition-colors duration-200 px-2 py-1.5 rounded-lg hover:bg-blue-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Cart</span>
                  {cart > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1 leading-none">
                      {cart}
                    </span>
                  )}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-400 px-4 py-1.5 rounded-lg transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-400 px-4 py-1.5 rounded-lg transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-4 py-1.5 rounded-lg transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default NavBar;
