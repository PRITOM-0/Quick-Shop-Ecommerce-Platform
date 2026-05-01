import React, { use } from "react";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import api from "../api/axios";

export const ProductList = () => {
  const [products, setProducts] = useState([]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;
    alert(
      "You can not delete the product right now. because you are not real admin. Please try again later.",
    );
    return;
    try {
      await api.delete(`/products/delete/${id}`);
      loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.Products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-gray-400 font-medium">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {products.length} products listed
            </p>
          </div>
          <Link
            to="/admin/addProduct"
            className="group inline-flex items-center gap-2 text-sm font-semibold 
  text-white bg-gradient-to-r from-blue-500 to-indigo-500 
  hover:from-blue-600 hover:to-indigo-600
  px-5 py-2.5 rounded-2xl 
  shadow-lg shadow-blue-200/50 
  hover:shadow-blue-300/60
  transition-all duration-300 ease-out
  active:scale-95"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 group-hover:rotate-90 transition-transform duration-300">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>

            <span className="tracking-wide">Add Product</span>
          </Link>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide py-3.5 px-5">
                  Image
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide py-3.5 px-5">
                  Title
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide py-3.5 px-5 hidden md:table-cell">
                  Description
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide py-3.5 px-5">
                  Stock
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide py-3.5 px-5">
                  Price
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide py-3.5 px-5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products?.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors duration-100"
                >
                  {/* Image */}
                  <td className="py-3 px-5">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-11 h-11 object-cover rounded-xl border border-gray-100 bg-gray-50"
                    />
                  </td>

                  {/* Title */}
                  <td className="py-3 px-5">
                    <p className="text-sm font-semibold text-gray-800 max-w-[140px] truncate">
                      {product.title}
                    </p>
                  </td>

                  {/* Description */}
                  <td className="py-3 px-5 hidden md:table-cell">
                    <p className="text-xs text-gray-400 max-w-[200px] truncate">
                      {product.description}
                    </p>
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-5">
                    <span
                      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                        product.stock > 10
                          ? "bg-green-50 text-green-600"
                          : product.stock > 0
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-red-50 text-red-500"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-5">
                    <span className="text-sm font-bold text-gray-800">
                      ${product.price.toFixed(2)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/editProduct/${product._id}`}
                        className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-lg transition-all duration-150"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-1.5 rounded-lg transition-all duration-150"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
