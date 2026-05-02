import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ordersAPI } from "../services/api";
import logo from "../assets/logo.png";
import DarkMode from "../components/Navbar/DarkMode";
import OrderReceipt from "../components/Checkout/OrderReceipt";
import {
  MdCheckCircle, MdLocalShipping, MdPending, MdCancel,
  MdReceipt, MdArrowBack, MdShoppingBag, MdRefresh,
} from "react-icons/md";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

/* ── Status badge ── */
const StatusBadge = ({ status }) => {
  const map = {
    confirmed: { label: "Confirmed",  icon: <MdCheckCircle />,   cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    shipped:   { label: "Shipped",    icon: <MdLocalShipping />, cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    pending:   { label: "Pending",    icon: <MdPending />,       cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    cancelled: { label: "Cancelled",  icon: <MdCancel />,        cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  };
  const s = map[status] || map.confirmed;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  );
};

/* ── Single order card ── */
const OrderCard = ({ order, onViewReceipt }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md duration-200 overflow-hidden">
      {/* Card header */}
      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-primary">#{order.id}</span>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              weekday: "short", year: "numeric", month: "short", day: "numeric",
            })}
            {" · "}
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-right">
            <p className="text-xs text-gray-400">Total</p>
            <p className="text-lg font-extrabold text-primary">${order.total.toFixed(2)}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary duration-200 dark:text-gray-300"
            >
              {expanded ? "Hide" : "Details"}
            </button>
            <button
              onClick={() => onViewReceipt(order)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary/80 to-secondary text-white hover:scale-105 duration-200"
            >
              <MdReceipt className="text-sm" /> Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-4 bg-gray-50 dark:bg-gray-800/50">
          {/* Items */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Items</p>
            <div className="flex flex-col gap-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.name}
                    <span className="text-gray-400 ml-1">× {item.qty}</span>
                  </span>
                  <span className="font-semibold dark:text-white">${item.lineTotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">📍 Delivery Address</p>
              <p className="font-medium dark:text-white text-xs leading-5">{order.address}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">💳 Payment Method</p>
              <p className="font-medium dark:text-white text-xs">{order.paymentMethod}</p>
            </div>
          </div>

          {/* Totals */}
          <div className="mt-3 bg-white dark:bg-gray-900 rounded-xl p-3 space-y-1.5">
            {[
              ["Subtotal", `$${order.subtotal.toFixed(2)}`],
              ["Shipping", order.shipping === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`],
              ["Tax (8%)", `$${order.tax.toFixed(2)}`],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{label}</span>
                <span className={val === "FREE" ? "text-green-500 font-semibold" : ""}>{val}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-gray-100 dark:border-gray-800 dark:text-white">
              <span>Total</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════
   Main Orders page
════════════════════════════════════════ */
const Orders = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [receipt, setReceipt]     = useState(null); // order to show in receipt modal
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError("");
    try {
      const data = await ordersAPI.getMyOrders();
      // newest first
      setOrders(data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) { navigate("/login"); return; }
    fetchOrders();
  }, [isLoggedIn]);

  const handleLogout = () => { logout(); navigate("/"); };

  /* ── Stats ── */
  const totalSpent   = orders.reduce((s, o) => s + o.total, 0);
  const totalItems   = orders.reduce((s, o) => s + o.items.reduce((si, i) => si + i.qty, 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-white duration-200">

      {/* ── Navbar ── */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link to="/shop" className="flex items-center gap-2 font-bold text-xl">
            <img src={logo} alt="Motorly" className="w-8 h-8" />
            <span className="hidden sm:block">Motorly</span>
          </Link>

          <div className="flex items-center gap-3">
            <DarkMode />
            <div className="flex items-center gap-2 text-sm">
              <FaUserCircle className="text-primary text-lg" />
              <span className="hidden sm:block font-medium max-w-[120px] truncate dark:text-white">
                {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 duration-200 font-medium"
            >
              <FaSignOutAlt /> <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                to="/shop"
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-primary duration-200"
              >
                <MdArrowBack /> Back to Shop
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold dark:text-white">My Orders</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Track and manage all your Motorly orders
            </p>
          </div>
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary duration-200 disabled:opacity-50 dark:text-gray-300 self-start sm:self-auto"
          >
            <MdRefresh className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ── Stats cards ── */}
        {orders.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Orders",  value: orders.length,          icon: "📦" },
              { label: "Items Ordered", value: totalItems,             icon: "🛒" },
              { label: "Total Spent",   value: `$${totalSpent.toFixed(2)}`, icon: "💰" },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="text-xl sm:text-2xl font-extrabold text-primary">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <p className="text-gray-400 text-sm">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
            <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Failed to load orders</p>
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button
              onClick={() => fetchOrders()}
              className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 duration-200 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-full mb-5">
              <MdShoppingBag className="text-primary text-5xl" />
            </div>
            <h2 className="text-xl font-bold mb-2 dark:text-white">No orders yet</h2>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link
              to="/shop"
              className="bg-gradient-to-r from-primary/80 to-secondary text-white font-semibold px-8 py-3 rounded-full hover:scale-105 duration-200 shadow-md"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          /* Orders list */
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewReceipt={setReceipt}
              />
            ))}
          </div>
        )}
      </div>

      {/* Receipt modal */}
      {receipt && (
        <OrderReceipt order={receipt} onClose={() => setReceipt(null)} />
      )}
    </div>
  );
};

export default Orders;
