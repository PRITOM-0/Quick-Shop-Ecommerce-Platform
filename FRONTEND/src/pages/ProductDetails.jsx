import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../api/axios";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);


  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${productId}`);
      setProduct(res.data.product || res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      setAddingToCart(true);
      for (let i = 0; i < quantity; i++) {
        await api.post("/cart/add", { userId, productId });
      }
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Product added to cart successfully!");
      navigate("/cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add product to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBackClick = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium mb-6 hover:underline transition-colors"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Home
      </button>

      {/* Product Details Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl border border-gray-100 p-8">
        {/* Image Section */}
        <div className="flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover max-h-96"
          />
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col justify-between">
          {/* Header Info */}
          <div>
            {/* Category Badge */}
            <span className="inline-block text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-200 mb-3">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {product.title}
            </h1>

            {/* Rating/Review (if available) */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                (4.0 based on reviews)
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Specs (if available) */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Product Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900">
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability:</span>
                  <span
                    className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of Stock"}
                  </span>
                </div>
                {product.sku && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium text-gray-900">
                      {product.sku}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="border-t border-gray-200 pt-6">
            {/* Price */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-1">Price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-sm text-gray-400">USD</span>
              </div>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-3">Quantity</p>
                <div className="flex items-center gap-3 border border-gray-300 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      setQuantity(Math.min(val, product.stock));
                    }}
                    className="w-12 text-center font-semibold border-none outline-none"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  product.stock === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 active:scale-95"
                } ${addingToCart ? "opacity-75" : ""}`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {addingToCart
                  ? "Adding..."
                  : product.stock === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
              </button>

              <button
                onClick={handleBackClick}
                className="py-3 px-4 rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Info Text */}
            <p className="text-xs text-gray-500 mt-4 text-center">
              Free shipping on orders over $50 • 30-day return policy
            </p>
          </div>
        </div>
      </div>

      {/* Related Products Section (Optional) */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          You might also like
        </h2>
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
          <p>Related products coming soon</p>
        </div>
      </div>
    </div>
  );
}
