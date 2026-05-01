import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.Products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const CATEGORIES = ["All", ...new Set(products.map((p) => p.category))];
  const SORT_OPTIONS = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Name A–Z", value: "name_asc" },
  ];

  const filtered = () => {
    let list = products;
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (search.trim())
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      );
    switch (sort) {
      case "price_asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price_desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "name_asc":
        return [...list].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return [...list].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
  };
  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to add items to your cart.");
      return;
    }
    try {
      await api.post("/cart/add", { userId, productId });
      window.dispatchEvent(new Event("cartUpdated"));
      // Show success notification
      setNotification({ show: true, message: "Product added to cart!", type: "success" });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" });
      }, 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setNotification({ show: true, message: "Failed to add product to cart", type: "error" });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "error" });
      }, 3000);
    }
  };


  return (
    <>
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-20 right-6 px-4 py-3 rounded-lg shadow-lg text-white font-semibold flex items-center gap-2 z-50 animate-pulse ${
          notification.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}>
          {notification.type === "success" ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          {notification.message}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-gray-50 border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
          
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Result count */}
          <span className="text-sm text-gray-400 ml-auto hidden sm:block">
            {filtered().length} products
          </span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered().map((p) => (
            <div
              key={p._id}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col"
            >
              {/* Image - Clickable */}
              <div 
                className="relative overflow-hidden bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* Category badge */}
                <span className="absolute top-3 left-3 text-[11px] font-medium bg-white/90 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                  {p.category}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <h3 
                  className="text-sm font-semibold text-gray-800 leading-snug line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  {p.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2 flex-1">
                  {p.description}
                </p>

                {/* Price */}
                <div className="mt-4 mb-3">
                  <span className="text-base font-bold text-gray-900">
                    ${p.price.toFixed(2)}
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button 
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 active:scale-95 px-2 py-2 rounded-lg transition-all duration-150"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p._id);
                    }}
                    title="Add to Cart"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Cart
                  </button>
                  <button 
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 active:scale-95 px-2 py-2 rounded-lg transition-all duration-150"
                    onClick={() => navigate(`/product/${p._id}`)}
                    title="View Product Details"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered().length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <p className="text-gray-400 text-sm">No products match your search.</p>
          </div>
        )}
      </div>
    </>
  );
}