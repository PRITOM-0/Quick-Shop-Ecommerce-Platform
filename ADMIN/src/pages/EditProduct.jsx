import React, { use } from "react";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useParams } from "react-router";

const EditProduct = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setFormData(res.data.product);
      } catch (err) {
        setMsg({
          error: err.response?.data?.message || "An error occurred. Please try again.",
          success: "",
        });
      }
    };
    loadProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleClear();
    alert("You can not update the product right now. because you are not real admin. Please try again later.");
    
    return;
    try {
      const res = await api.put(`/products/update/${id}`, formData);
      navigate("/admin/allProducts");
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFormData({ title: "", description: "", price: "", category: "", image: "", stock: "" });
  };

  const fields = [
    {
      name: "title", label: "Title", placeholder: "e.g. Wireless Headphones", type: "text", required: true, span: true,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />,
    },
    {
      name: "price", label: "Price ($)", placeholder: "0.00", type: "number", required: true,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      name: "category", label: "Category", placeholder: "e.g. Electronics", type: "text", required: true,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
    },
    {
      name: "stock", label: "Stock", placeholder: "0", type: "number",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
    },
    {
      name: "image", label: "Image URL", placeholder: "https://...", type: "text", span: true,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    },
    {
      name: "description", label: "Description", placeholder: "Describe the product...", type: "text", span: true,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">

        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          </div>
          <p className="text-sm text-gray-400 ml-6">Update the product details below.</p>
        </div>

        {/* Image preview card */}
        {formData.image && (
          <div className="mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-3 border-b border-gray-50">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-medium text-gray-400">Current Image</span>
            </div>
            <img
              src={formData.image}
              alt={formData.title}
              className="w-full h-48 object-cover bg-gray-50"
              onError={(e) => e.target.closest("div.mb-4").classList.add("hidden")}
            />
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Card header */}
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800">Product Details</span>
            {formData.title && (
              <span className="ml-auto text-xs text-gray-400 truncate max-w-[160px]">{formData.title}</span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.name} className={field.span ? "sm:col-span-2" : ""}>
                  <label
                    htmlFor={field.name}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {field.icon}
                    </svg>
                    {field.label}
                    {field.required && <span className="text-red-400 ml-0.5">*</span>}
                  </label>
                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-300"
                  />
                </div>
              ))}
            </div>

            {/* Live image URL preview update */}
            {formData.image && (
              <div className="mt-4 sm:col-span-2">
                <p className="text-xs font-medium text-gray-400 mb-1.5">Updated Preview</p>
                <img
                  src={formData.image}
                  alt="preview"
                  className="w-full h-40 object-cover rounded-xl border border-gray-100 bg-gray-50"
                  onError={(e) => e.target.classList.add("hidden")}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-400 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 px-4 py-2.5 rounded-xl transition-all duration-150"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-sm font-bold py-2.5 rounded-xl transition-all duration-150 shadow-md shadow-blue-100"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Update Product
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default EditProduct;