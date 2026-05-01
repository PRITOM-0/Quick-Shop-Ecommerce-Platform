import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

const Checkout = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [addAddress, setAddAddress] = useState(false);
  const [allAddress, setAllAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const [cartItems, setCartItems] = useState([]);
  const [addressForm, setAddressForm] = useState([
    { name: "fullName", label: "Full Name", value: "" },
    { name: "phone", label: "Phone", value: "" },
    { name: "area", label: "Area", value: "" },
    { name: "district", label: "District", value: "" },
    { name: "division", label: "Division", value: "" },
  ]);

  const [order, setOrder] = useState({});

  const handleChange = (e) => {
    setAddressForm((prev) =>
      prev.map((field) =>
        field.name === e.target.name
          ? { ...field, value: e.target.value }
          : field,
      ),
    );
  };

  const loadCart = async () => {
    if (!userId) return setCartItems([]);
    try {
      const res = await api.get(`/cart/${userId}`);
      setCartItems(res.data.cart.items);
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  };

  const loadAddress = async () => {
    try {
      const res = await api.post(`/address`, { userId });
      if (res.data.addresses) {
        setAllAddress(res.data.addresses);
      }
    } catch (err) {
      console.error("Error loading address:", err);
    }
  };

  const saveAddress = async () => {
    const newAddress = {
      user: userId,
      fullName: addressForm.find((f) => f.name === "fullName").value,
      phone: addressForm.find((f) => f.name === "phone").value,
      area: addressForm.find((f) => f.name === "area").value,
      district: addressForm.find((f) => f.name === "district").value,
      division: addressForm.find((f) => f.name === "division").value,
    };
    try {
      const res = await api.post("/address/add", newAddress);
      if (res.data.address) {
        loadAddress();
        setAddressForm([
          { name: "fullName", label: "Full Name", value: "" },
          { name: "phone", label: "Phone", value: "" },
          { name: "area", label: "Area", value: "" },
          { name: "district", label: "District", value: "" },
          { name: "division", label: "Division", value: "" },
        ]);
        setAddAddress(false);
      } else {
        console.error("Error saving address:", res.data);
      }
    } catch (err) {
      console.error("Error saving address:", err);
    }
  };

  useEffect(() => {
    loadCart();
    loadAddress();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    saveAddress();
    setAddAddress(false);
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.productId.price) * item.quantity,
    0,
  );

  const PAYMENT_METHODS = [
    { value: "COD", label: "Cash on Delivery", icon: "💵", available: true },
    { value: "Bkash", label: "bKash", icon: "📱", available: false },
    { value: "Nagad", label: "Nagad", icon: "📲", available: false },
    { value: "Rocket", label: "Rocket", icon: "🚀", available: false },
  ];

  const clearCart = async () => {
    try {
      await api.post(`/cart/clear`, { userId });
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const orderHandle = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }
    if (!selectedPayment) {
      alert("Please select a payment method.");
      return;
    }
    const orderData = {
      user: userId,
      items: cartItems.map((item) => ({
        product: item.productId._id,
        quantity: item.quantity,
      })),
      totalAmount: subtotal,
      address: selectedAddress,
      status: "processing",
    };
    try {
      const res = await api.post("/orders/add", orderData);
      if (res.data) {
        setOrder({});
        await clearCart();
        window.dispatchEvent(new Event("cartUpdated"));
        navigate(`/order/${res.data._id}`);
      } else {
        console.error("Error placing order:", res.data);
        alert("Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-400 mt-1">
            Complete your order below
          </p>
        </div>

        <div className="space-y-4">
          {/* ── Delivery Address ── */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Section header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <div className="flex items-center gap-2.5">
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
                <h2 className="text-sm font-semibold text-gray-800">
                  Delivery Address
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAddAddress(!addAddress)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                  addAddress
                    ? "border-gray-200 text-gray-400 hover:bg-gray-50"
                    : "border-blue-100 text-blue-500 bg-blue-50 hover:bg-blue-100"
                }`}
              >
                {addAddress ? "Cancel" : "+ Add New"}
              </button>
            </div>

            <div className="px-6 py-5">
              {/* Address form */}
              {addAddress && (
                <form
                  onSubmit={handleSubmit}
                  className="mb-5 pb-5 border-b border-gray-100"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {addressForm.map((field) => (
                      <div
                        key={field.name}
                        className={
                          field.name === "fullName" ? "sm:col-span-2" : ""
                        }
                      >
                        <label
                          htmlFor={field.name}
                          className="block text-xs font-medium text-gray-400 mb-1.5"
                        >
                          {field.label}
                        </label>
                        <input
                          type={field.type || "text"}
                          name={field.name}
                          required
                          value={field.value}
                          onChange={handleChange}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-300"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="text-sm font-semibold text-white bg-green-500 hover:bg-green-600 active:scale-95 px-5 py-2 rounded-xl transition-all duration-150 shadow-sm"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {/* Saved address cards */}
              {allAddress.length > 0 ? (
                <div className="space-y-2.5">
                  {allAddress.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr._id)}
                      className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                        selectedAddress === addr._id
                          ? "border-blue-400 bg-blue-50/60 shadow-sm"
                          : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
                      }`}
                    >
                      {/* Radio */}
                      <div
                        className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                          selectedAddress === addr._id
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAddress === addr._id && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">
                          {addr.fullName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {addr.area}, {addr.district}, {addr.division}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {addr.zipCode}
                          {addr.country ? `, ${addr.country}` : ""} ·{" "}
                          {addr.phone}
                        </p>
                      </div>
                      {selectedAddress === addr._id && (
                        <span className="shrink-0 text-[10px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <svg
                      className="w-5 h-5 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-400">
                    No saved addresses
                  </p>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Click "+ Add New" above to get started
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ── Payment Method ── */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
              <h2 className="text-sm font-semibold text-gray-800">
                Payment Method
              </h2>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.value}
                    onClick={() =>
                      method.available && setSelectedPayment(method.value)
                    }
                    className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-150 ${
                      !method.available
                        ? "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed"
                        : selectedPayment === method.value
                          ? "border-blue-400 bg-blue-50/60 shadow-sm cursor-pointer"
                          : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white cursor-pointer"
                    }`}
                  >
                    {!method.available && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-semibold bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full whitespace-nowrap tracking-wide uppercase">
                        Soon
                      </span>
                    )}
                    <span className="text-xl">{method.icon}</span>
                    <span
                      className={`text-[11px] font-semibold text-center leading-tight ${
                        selectedPayment === method.value
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    >
                      {method.label}
                    </span>
                    {method.available && (
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedPayment === method.value
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPayment === method.value && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Order Summary ── */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h2 className="text-sm font-semibold text-gray-800">
                Order Summary
              </h2>
              <span className="ml-auto text-xs text-gray-400 font-medium">
                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="px-6 pt-4">
              <div className="divide-y divide-gray-50">
                {cartItems.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex items-center gap-4 py-3"
                  >
                    <img
                      src={item.productId.image}
                      alt={item.productId.title}
                      className="w-11 h-11 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {item.productId.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-800 shrink-0">
                      $
                      {(Number(item.productId.price) * item.quantity).toFixed(
                        2,
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="mx-6 mt-3 mb-5 pt-4 border-t border-gray-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Subtotal</span>
                <span className="text-xs font-semibold text-gray-600">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Delivery Charge</span>
                <span className="text-xs font-semibold text-gray-600">
                  $2.00
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm font-bold text-gray-800">Total</span>
                <span className="text-lg font-bold text-blue-500">
                  ${(subtotal + 2).toFixed(2)}
                </span>
              </div>
            </div>
          </section>

          {/* ── Actions ── */}
          <div className="flex items-center gap-3 pt-1 pb-6">
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-400 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 px-5 py-3 rounded-xl transition-all duration-150 shadow-sm"
            >
              ← Back
            </button>
            <button
              onClick={orderHandle}
              className="flex-1 bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-sm font-bold py-3 rounded-xl transition-all duration-150 shadow-md shadow-blue-100"
            >
              Place Order →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
