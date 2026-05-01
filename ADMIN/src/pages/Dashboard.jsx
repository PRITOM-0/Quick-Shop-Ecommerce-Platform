import React from "react";
import { Link } from "react-router";
import api from "../api/axios";

import { useState, useEffect, useRef } from "react";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState([]);


  const loadOrder = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
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
  const loadUser = async () => {
    try {
      const res = await api.get("/users");
      setUser(res.data.User);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
    loadOrder();
    loadUser();
  }, []);

  // Forchart// Forchart// Forchart// Forchart// Forchart// Forchart// Forchart// Forchart
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const barChartRef = useRef(null);
  const barChartInstance = useRef(null);

  useEffect(() => {
    if (!orders.length) return;

    const initCharts = () => {
      // --- Line Chart ---
      const getWeeklyRevenue = (monthOffset) => {
        const now = new Date();
        const targetMonth = now.getMonth() - monthOffset;
        const targetYear = now.getFullYear();
        const weeks = [0, 0, 0, 0];
        orders.forEach((order) => {
          const d = new Date(order.createdAt);
          const orderMonth = (targetMonth + 12) % 12;
          const orderYear = targetMonth < 0 ? targetYear - 1 : targetYear;
          if (d.getMonth() === orderMonth && d.getFullYear() === orderYear) {
            const week = Math.min(Math.floor((d.getDate() - 1) / 7), 3);
            weeks[week] += order.totalAmount || 0;
          }
        });
        return weeks;
      };

      const thisMonth = getWeeklyRevenue(0);
      const lastMonth = getWeeklyRevenue(1);
      const lineCtx = chartRef.current?.getContext("2d");
      if (lineCtx) {
        if (chartInstance.current) chartInstance.current.destroy();
        chartInstance.current = new window.Chart(lineCtx, {
          type: "line",
          data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [
              {
                label: "This Month",
                data: thisMonth,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59,130,246,0.07)",
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: "#3b82f6",
                borderWidth: 2,
              },
              {
                label: "Last Month",
                data: lastMonth,
                borderColor: "#9ca3af",
                borderDash: [6, 4],
                backgroundColor: "transparent",
                fill: false,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: "#9ca3af",
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: { label: (c) => " $" + c.parsed.y.toFixed(2) },
              },
            },
            scales: {
              x: { ticks: { color: "#6b7280", font: { size: 12 } } },
              y: {
                ticks: {
                  color: "#6b7280",
                  font: { size: 12 },
                  callback: (v) => "$" + (v / 1000).toFixed(1) + "k",
                },
              },
            },
          },
        });
      }

      // --- Bar Chart ---
      const productSales = {};
      orders.forEach((order) => {
        order.items?.forEach((item) => {
          const name = item.product?.title || item.title || "Unknown";
          productSales[name] = (productSales[name] || 0) + (item.quantity || 1);
        });
      });

      const sorted = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      const labels = sorted.map(([name]) =>
        name.length > 15 ? name.slice(0, 15) + "…" : name,
      );
      const data = sorted.map(([, qty]) => qty);

      const colors = [
        "#3b82f6",
        "#8b5cf6",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#06b6d4",
        "#f97316",
        "#84cc16",
        "#ec4899",
        "#6366f1",
      ];

      const barCtx = barChartRef.current?.getContext("2d");
      if (barCtx) {
        if (barChartInstance.current) barChartInstance.current.destroy();
        barChartInstance.current = new window.Chart(barCtx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Units Sold",
                data,
                backgroundColor: colors.map((c) => c + "cc"),
                borderColor: colors,
                borderWidth: 1,
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: { label: (c) => " " + c.parsed.y + " units sold" },
              },
            },
            scales: {
              x: {
                ticks: {
                  color: "#6b7280",
                  font: { size: 11 },
                  autoSkip: false,
                  maxRotation: 35,
                },
                grid: { display: false },
              },
              y: {
                ticks: { color: "#6b7280", font: { size: 12 } },
                grid: { color: "rgba(0,0,0,0.05)" },
                beginAtZero: true,
              },
            },
          },
        });
      }
    };

    // If Chart.js already loaded, use it directly
    if (window.Chart) {
      initCharts();
    } else {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
      script.async = true;
      script.onload = initCharts;
      document.head.appendChild(script);
    }

    return () => {
      chartInstance.current?.destroy();
      barChartInstance.current?.destroy();
    };
  }, [orders]);

  // Forchart// Forchart// Forchart// Forchart// Forchart// Forchart// Forchart// Forchart

  // Mock data for UI demonstration
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalUsers: user.length,
    totalRevenue: orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0,
    ),
  };

  const recentOrders = orders.slice(0, 5);

  const topProducts = products.sort((a, b) => b.stock - a.stock).slice(0, 5);

  const lowStockProducts = [...products]
    .filter((p) => p.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);
  const users = user.slice(0, 5);
  // Chart

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your admin panel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales & Revenue Line Graph */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Sales & Revenue
                </h2>
                <p className="text-sm text-gray-600">
                  This month vs last month
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-8 h-0.5 bg-blue-500 rounded"></span>
                  This month
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-8 h-0.5 bg-gray-400 rounded"></span>
                  Last month
                </span>
              </div>
            </div>
            <div
              style={{ position: "relative", width: "100%", height: "260px" }}
            >
              <canvas
                ref={chartRef}
                role="img"
                aria-label="Revenue comparison this month vs last month"
              />
            </div>
          </div>

          {/* Top 10 Selling Products Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Top 10 Selling Products
              </h2>
              <p className="text-sm text-gray-600">Units sold per product</p>
            </div>
            <div
              style={{ position: "relative", width: "100%", height: "260px" }}
            >
              <canvas
                ref={barChartRef}
                role="img"
                aria-label="Bar chart of top 10 selling products by units sold"
              />
            </div>
          </div>
        </div>
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
              <p className="text-sm text-gray-600">Latest customer orders</p>
            </div>
            <Link
              to="/admin/allOrders"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-6">
                    Order ID
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-6">
                    Customer
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-6">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-6">
                    Total
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-6">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-gray-900">
                        {order.Code}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600">{order.user.name}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Overview and Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Product Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Overview High Stock
                </h2>
                <p className="text-sm text-gray-600">Top products by stock</p>
              </div>
              <Link
                to="/admin/allProducts"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View All →
              </Link>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                          {product.title}
                        </p>
                        <p className="text-xs text-green-600">
                          {product.stock} Available now
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {lowStockProducts.length === 0 && (
                  <div className="text-center py-8">
                    <svg
                      className="w-12 h-12 text-green-500 mx-auto mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      All products are well stocked!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Low Stock Alerts
              </h2>
              <p className="text-sm text-gray-600">Products running low</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                          {product.title}
                        </p>
                        <p className="text-xs text-red-600">
                          Only {product.stock} left
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/admin/editProduct/${product.id}`}
                      className="text-xs font-medium text-red-600 hover:text-red-800"
                    >
                      Restock →
                    </Link>
                  </div>
                ))}
                {lowStockProducts.length === 0 && (
                  <div className="text-center py-8">
                    <svg
                      className="w-12 h-12 text-green-500 mx-auto mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      All products are well stocked!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              User Management
            </h2>
            <p className="text-sm text-gray-600">
              Manage user roles and permissions
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-6">
                    Name
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-6">
                    Email
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-6">
                    Role
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-6">
                    Joined
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {"User"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        defaultValue={user.role}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
