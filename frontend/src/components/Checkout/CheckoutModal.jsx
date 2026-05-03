import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { MdLocationOn, MdPhone, MdPayment, MdCheckCircle } from "react-icons/md";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { ordersAPI } from "../../services/api";
import OrderReceipt from "./OrderReceipt";

const STEPS = ["Cart", "Delivery", "Payment", "Confirm"];

const CheckoutModal = ({ onClose, product }) => {
  const { user } = useAuth();
  const { items: cartItems, clearCart } = useCart();

  const [step, setStep]               = useState(0);
  const [loading, setLoading]         = useState(false);
  const [serverError, setServerError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  /* ── Cart: use passed product OR global cart ── */
  const [cart, setCart] = useState(() => {
    if (product) {
      return [{ productId: product.id, name: product.name, price: product.price, qty: 1 }];
    }
    return cartItems.map((i) => ({ productId: i.productId, name: i.name, price: i.price, qty: i.qty }));
  });

  /* ── Delivery form ── */
  const [delivery, setDelivery] = useState({
    address: "",
    city: "",
    zip: "",
    phone: user?.phone || "",
  });
  const [deliveryErrors, setDeliveryErrors] = useState({});

  /* ── Payment ── */
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  /* ── Cart helpers ── */
  const updateQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping  = subtotal >= 100 ? 0 : 9.99;
  const tax       = subtotal * 0.08;
  const total     = subtotal + shipping + tax;

  /* ── Delivery validation ── */
  const validateDelivery = () => {
    const errs = {};
    if (!delivery.address.trim()) errs.address = "Address is required";
    if (!delivery.city.trim())    errs.city    = "City is required";
    if (!delivery.zip.trim())     errs.zip     = "ZIP / Postal code is required";
    if (!delivery.phone.trim())   errs.phone   = "Phone number is required";
    return errs;
  };

  /* ── Place order ── */
  const handlePlaceOrder = async () => {
    setServerError("");
    setLoading(true);
    try {
      const fullAddress = `${delivery.address}, ${delivery.city} ${delivery.zip}`;
      const data = await ordersAPI.placeOrder({
        items: cart.map((i) => ({ productId: i.productId, qty: i.qty })),
        address: fullAddress,
        phone: delivery.phone,
        paymentMethod,
      });
      setPlacedOrder(data.order);
      clearCart(); // clear global cart after successful order
      setStep(4);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── If order placed, show receipt ── */
  if (step === 4 && placedOrder) {
    return <OrderReceipt order={placedOrder} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto duration-200">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold dark:text-white">Checkout</h2>
            <p className="text-xs text-gray-400 mt-0.5">Step {step + 1} of {STEPS.length}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 duration-200">
            <IoCloseOutline className="text-2xl" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-1.5 ${i <= step ? "text-primary" : "text-gray-300 dark:text-gray-600"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                    i < step  ? "bg-primary border-primary text-white" :
                    i === step ? "border-primary text-primary bg-primary/10" :
                    "border-gray-300 dark:border-gray-600 text-gray-400"
                  }`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className="hidden sm:block text-xs font-medium">{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 transition-all duration-300 ${i < step ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">

          {/* ── STEP 0: Cart ── */}
          {step === 0 && (
            <div>
              <h3 className="font-semibold text-base mb-4 dark:text-white">Your Cart</h3>
              {cart.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">Your cart is empty.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm dark:text-white truncate">{item.name}</p>
                        <p className="text-primary font-bold text-sm">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.productId, -1)}
                          className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary duration-200 font-bold"
                        >−</button>
                        <span className="w-6 text-center text-sm font-semibold dark:text-white">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.productId, 1)}
                          className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary duration-200 font-bold"
                        >+</button>
                      </div>
                      <p className="text-sm font-bold dark:text-white w-16 text-right">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Order summary */}
              {cart.length > 0 && (
                <div className="mt-5 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-500 font-medium" : ""}>
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200 dark:border-gray-700 dark:text-white">
                    <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                  {subtotal < 100 && (
                    <p className="text-xs text-gray-400 text-center pt-1">
                      Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 1: Delivery ── */}
          {step === 1 && (
            <div>
              <h3 className="font-semibold text-base mb-4 dark:text-white">Delivery Details</h3>
              <div className="flex flex-col gap-4">

                {/* Logged-in user info */}
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                </div>

                {[
                  { key: "address", label: "Street Address", placeholder: "123 Main Street", icon: <MdLocationOn /> },
                  { key: "city",    label: "City",           placeholder: "New York",         icon: <MdLocationOn /> },
                  { key: "zip",     label: "ZIP / Postal Code", placeholder: "10001",         icon: <MdLocationOn /> },
                  { key: "phone",   label: "Phone Number",   placeholder: "+1 234 567 8900",  icon: <MdPhone /> },
                ].map(({ key, label, placeholder, icon }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                    <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 transition-all duration-200 ${
                      deliveryErrors[key]
                        ? "border-red-400"
                        : "border-gray-300 dark:border-gray-600 focus-within:border-primary"
                    }`}>
                      <span className="text-gray-400 text-lg flex-shrink-0">{icon}</span>
                      <input
                        type="text"
                        value={delivery[key]}
                        onChange={(e) => {
                          setDelivery({ ...delivery, [key]: e.target.value });
                          if (deliveryErrors[key]) setDeliveryErrors({ ...deliveryErrors, [key]: "" });
                        }}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500 dark:text-white"
                      />
                    </div>
                    {deliveryErrors[key] && <p className="text-red-500 text-xs">{deliveryErrors[key]}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Payment ── */}
          {step === 2 && (
            <div>
              <h3 className="font-semibold text-base mb-4 dark:text-white">Payment Method</h3>
              <div className="flex flex-col gap-3">
                {[
                  { id: "Cash on Delivery", label: "Cash on Delivery", sub: "Pay when your order arrives", icon: <FaMoneyBillWave className="text-green-500 text-xl" /> },
                  { id: "Credit Card",      label: "Credit / Debit Card", sub: "Visa, Mastercard, Amex", icon: <FaCreditCard className="text-blue-500 text-xl" /> },
                  { id: "Bank Transfer",    label: "Bank Transfer",    sub: "Direct bank payment",       icon: <MdPayment className="text-purple-500 text-xl" /> },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/40"
                    }`}
                  >
                    <div className="flex-shrink-0">{method.icon}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm dark:text-white">{method.label}</p>
                      <p className="text-xs text-gray-400">{method.sub}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      paymentMethod === method.id ? "border-primary" : "border-gray-300 dark:border-gray-600"
                    }`}>
                      {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod === "Credit Card" && (
                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p className="text-blue-700 dark:text-blue-300 text-xs font-medium">
                    💳 Card payment will be processed at checkout. Your card details are encrypted and secure.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: Confirm ── */}
          {step === 3 && (
            <div>
              <h3 className="font-semibold text-base mb-4 dark:text-white">Order Summary</h3>

              {/* Items */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Items</p>
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm py-1.5 dark:text-white">
                    <span className="text-gray-600 dark:text-gray-300">{item.name} × {item.qty}</span>
                    <span className="font-semibold">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Delivery */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Delivery</p>
                <p className="text-sm dark:text-white">{delivery.address}, {delivery.city} {delivery.zip}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{delivery.phone}</p>
              </div>

              {/* Payment */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Payment</p>
                <p className="text-sm dark:text-white">{paymentMethod}</p>
              </div>

              {/* Totals */}
              <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-500 font-medium" : ""}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-primary/20 dark:text-white">
                  <span>Total</span><span className="text-primary text-lg">${total.toFixed(2)}</span>
                </div>
              </div>

              {serverError && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">{serverError}</p>
                </div>
              )}

              <p className="text-xs text-gray-400 text-center mt-4">
                📧 A confirmation email will be sent to <strong>{user?.email}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 py-4 flex gap-3 rounded-b-2xl">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              disabled={loading}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 duration-200 disabled:opacity-50"
            >
              ← Back
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => {
                if (step === 0 && cart.length === 0) return;
                if (step === 1) {
                  const errs = validateDelivery();
                  if (Object.keys(errs).length > 0) { setDeliveryErrors(errs); return; }
                }
                setStep(step + 1);
              }}
              disabled={step === 0 && cart.length === 0}
              className="flex-1 bg-gradient-to-r from-primary/80 to-secondary text-white font-semibold py-3 rounded-xl hover:scale-[1.02] duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-xl hover:scale-[1.02] duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Placing Order...
                </>
              ) : "Place Order 🚗"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
