import React from "react";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

const Cart = () => {
  const navigator = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem("userId");
  const subPrice = cartItems.reduce(
    (total, item) =>10+ total + Number(item.productId.price) * item.quantity,
    0,
  );
  const totalPrice = subPrice + 10;

  const loadCart = async () => {
    if (!userId) return setCartItems([]);
    try {
      const res = await api.get(`/cart/${userId}`);
      setCartItems(res.data.cart.items);
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      await api.post(`/cart/remove`, { userId, productId });
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error removing item from cart:", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    try {
      await api.post(`/cart/update`, { userId, productId, quantity });
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error updating cart item quantity:", err);
    }
  };

  // Empty state
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <svg className="h-16 w-16 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700 mb-1">Your cart is empty</h2>
        <p className="text-sm text-gray-400">Add some products to get started.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Shopping Cart
        <span className="ml-2 text-sm font-normal text-gray-400">
          ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
        </span>
      </h2>

      {/* Column labels */}
      <div className="hidden sm:grid grid-cols-12 text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 px-4">
        <span className="col-span-6">Product</span>
        <span className="col-span-2 text-center">Quantity</span>
        <span className="col-span-2 text-right">Price</span>
        <span className="col-span-2 text-right">Remove</span>
      </div>

      {/* Cart items */}
      <div className="space-y-3">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-12 items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 hover:shadow-sm transition-shadow"
          >
            {/* Product info */}
            <div className="col-span-6 flex items-center gap-3">
              {item.productId.image && (
                <img
                  src={item.productId.image}
                  alt={item.productId.title}
                  className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {item.productId.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  ${Number(item.productId.price).toFixed(2)} each
                </p>
              </div>
            </div>

            {/* Quantity controls */}
            <div className="col-span-2 flex items-center justify-center gap-1">
              <button
                onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300 active:scale-95 transition-all text-sm font-bold"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-semibold text-gray-700">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300 active:scale-95 transition-all text-sm font-bold"
              >
                +
              </button>
            </div>

            {/* Subtotal*/}
            <div className="col-span-2 flex items-center justify-end gap-3">
              <span className="text-sm font-bold text-gray-800">
                ${(Number(item.productId.price) * item.quantity).toFixed(2)}
              </span>
              
            </div>
            {/*remove */}

            <div className="col-span-2 flex items-center justify-end gap-3">
            <button
                onClick={() => removeFromCart(item.productId._id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 active:scale-95 transition-all"
                title="Remove"
              >
                <svg className="text-red-500 hover:text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary + Checkout */}
      <div className="mt-6 bg-gray-50 border border-gray-100 rounded-xl px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Subtotal</span>
          <span className="text-sm font-semibold text-gray-700">
            ${Number(subPrice).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Tax</span>
          <span className="text-sm font-semibold text-gray-700">
           $10.00
          </span>
        </div>
        <div className="flex items-center justify-between mb-5 border-t border-gray-200 pt-4">
          <span className="text-base font-bold text-gray-800">Total</span>
          <span className="text-xl font-bold text-blue-600">
            ${Number(totalPrice).toFixed(2)}
          </span>
        </div>
        <button onClick={() => navigator("/checkout")} className="w-full bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-sm font-semibold py-3 rounded-xl transition-all duration-150">
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
};

export default Cart;