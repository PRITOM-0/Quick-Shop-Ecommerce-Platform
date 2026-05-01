import { useParams } from "react-router";
import api from "../api/axios";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

const Order = () => {
  
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  console.log(order)

  const fetchOrderDetails = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Error fetching order details:", err);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {order ? (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* ── Success Banner ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              Order Placed Successfully!
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Thank you for your purchase. We'll get it to you soon.
            </p>

            {/* Order code */}
            <div className="mt-5 inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-5 py-2.5">
              <span className="text-xs text-blue-400 font-medium">
                Order Code
              </span>
              <span className="text-base font-bold text-blue-600 tracking-widest">
                {order.Code}
              </span>
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Payment</p>
              <p className="text-sm font-bold text-green-500">
                Cash on Delivery
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Products</p>
              <p className="text-xl font-bold text-gray-800">
                {order.items.length}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Total Items</p>
              <p className="text-xl font-bold text-gray-800">
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Status</p>
              <span className="inline-block text-xs font-bold text-yellow-600 bg-yellow-50 border border-yellow-100 px-2.5 py-1 rounded-full capitalize">
                {order.status}
              </span>
            </div>
          </div>

          {/* ── Items ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">
                Order Items
              </h3>
              <span className="ml-auto text-xs text-gray-400">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="px-6 divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-4 py-3.5">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {item.product.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-800 shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mx-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">
                Total Amount
              </span>
              <span className="text-lg font-bold text-blue-500">
                ${order.totalAmount}
              </span>
            </div>
          </div>

          {/* ── User info ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">
                User information
              </h3>
            </div>

            <div className="px-6 py-5 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400 w-16 shrink-0">
                  Name
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {order.user.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400 w-16 shrink-0">
                  Email
                </span>
                <span className="text-sm text-gray-700">
                  {order.user.email}
                </span>
              </div>
            </div>
          </div>
          {/* ── Delivery Address ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">
                Delivery Address
              </h3>
            </div>

            <div className="px-6 py-5 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400 w-16 shrink-0">
                  Name
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {order.address.fullName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400 w-16 shrink-0">
                  Phone
                </span>
                <span className="text-sm text-gray-700">
                  {order.address.phone}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs font-medium text-gray-400 w-16 shrink-0 mt-0.5">
                  Location
                </span>
                <span className="text-sm text-gray-700">
                  {order.address.area}, {order.address.district},{" "}
                  {order.address.division}
                </span>
              </div>
            </div>
          </div>

          {/* ── Action ── */}
          <div className="pb-6">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-sm font-bold py-3.5 rounded-2xl transition-all duration-150 shadow-md shadow-blue-100"
            >
              Back to Home →
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading order details...</p>
        </div>
      )}
    </div>
  );
};

export default Order;
