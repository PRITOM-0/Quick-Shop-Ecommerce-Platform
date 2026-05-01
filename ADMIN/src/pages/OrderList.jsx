import React, { useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";
import { useEffect } from "react";

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [orders]);

  // // Mock orders data
  // const orders = [
  //   {
  //     id: 'QSO-12345',
  //     customer: { name: 'John Doe', email: 'john@example.com' },
  //     status: 'delivered',
  //     total: 299.99,
  //     date: '2024-01-15',
  //     items: [
  //       { name: 'Wireless Headphones', quantity: 1, price: 199.99 },
  //       { name: 'USB-C Cable', quantity: 1, price: 99.99 }
  //     ],
  //     address: '123 Main St, City, State 12345'
  //   },
  //   {
  //     id: 'QSO-12346',
  //     customer: { name: 'Jane Smith', email: 'jane@example.com' },
  //     status: 'shipped',
  //     total: 149.50,
  //     date: '2024-01-14',
  //     items: [
  //       { name: 'Bluetooth Speaker', quantity: 1, price: 79.99 },
  //       { name: 'Phone Case', quantity: 1, price: 69.50 }
  //     ],
  //     address: '456 Oak Ave, Town, State 67890'
  //   },
  //   {
  //     id: 'QSO-12347',
  //     customer: { name: 'Bob Johnson', email: 'bob@example.com' },
  //     status: 'processing',
  //     total: 79.99,
  //     date: '2024-01-14',
  //     items: [
  //       { name: 'Laptop Stand', quantity: 1, price: 49.99 },
  //       { name: 'Mouse Pad', quantity: 1, price: 29.99 }
  //     ],
  //     address: '789 Pine Rd, Village, State 54321'
  //   },
  //   {
  //     id: 'QSO-12348',
  //     customer: { name: 'Alice Brown', email: 'alice@example.com' },
  //     status: 'pending',
  //     total: 199.99,
  //     date: '2024-01-13',
  //     items: [
  //       { name: 'Smart Watch', quantity: 1, price: 199.99 }
  //     ],
  //     address: '321 Elm St, Borough, State 98765'
  //   },
  //   {
  //     id: 'QSO-12349',
  //     customer: { name: 'Charlie Wilson', email: 'charlie@example.com' },
  //     status: 'delivered',
  //     total: 349.99,
  //     date: '2024-01-12',
  //     items: [
  //       { name: 'Gaming Mouse', quantity: 1, price: 79.99 },
  //       { name: 'Mechanical Keyboard', quantity: 1, price: 149.99 },
  //       { name: 'Webcam HD', quantity: 1, price: 119.99 }
  //     ],
  //     address: '654 Maple Dr, Hamlet, State 13579'
  //   },
  //   {
  //     id: 'QSO-12350',
  //     customer: { name: 'Diana Prince', email: 'diana@example.com' },
  //     status: 'shipped',
  //     total: 129.99,
  //     date: '2024-01-11',
  //     items: [
  //       { name: 'Wireless Charger', quantity: 1, price: 39.99 },
  //       { name: 'Power Bank', quantity: 1, price: 89.99 }
  //     ],
  //     address: '987 Cedar Ln, County, State 24680'
  //   }
  // ];

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = async (orderId, newStatus) => {
    const confirmed = window.confirm(
      "Are you sure you want to update this order?"
    );

    if (!confirmed) return;
    try {
      await api.post("/orders/update", { orderId, status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDelete = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?",
    );

    if (!confirmed) return;
    alert("You can not delete the order right now. because you are not real admin. Please try again later.");
    return;
    try {
      await api.post("/orders/delete", { orderId });
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId),
      );
      console.log(`Deleting order ${orderId}`);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filteredOrders.length} orders found
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Orders
              </label>
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                    Items
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-6">
                    Total
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-6">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-6">
                    Date
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-gray-900">
                        {order.Code}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600 font-bold">
                        {order.items.reduce(
                          (total, item) => total + item.quantity,
                          0,
                        )}{" "}
                        product
                        {order.items.reduce(
                          (total, item) => total + item.quantity,
                          0,
                        ) !== 1
                          ? "s"
                          : ""}{" "}
                        {" - "}
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {/* View details */}
                        {/* View Details Button */}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 
                          hover:border-blue-600 
                          transition "
                        >
                          View details
                        </button>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-lg border border-red-200 transition hover:border-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-12 px-6 text-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mx-auto mb-4"
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
                      <p className="text-gray-500">
                        No orders found matching your criteria
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order Details
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Order #{selectedOrder.Code}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Customer Information
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.user.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.user.email}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Order Information
                    </h3>
                    <p className="text-sm text-gray-600">
                      Date:{" "}
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status:
                      <span
                        className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}
                      >
                        {selectedOrder.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Shipping Address
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.address.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.address.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.address.area},{" "}
                    {selectedOrder.address.district}{" "}
                    {selectedOrder.address.division}
                  </p>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder?.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.product.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          $
                          {Number(item.product.price * item.quantity).toFixed(
                            2,
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-3">
                    <p className="text-sm font-medium text-gray-900">Total</p>
                    <p className="text-lg font-bold text-gray-900">
                      ${Number(selectedOrder.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
