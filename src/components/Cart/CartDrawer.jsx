import React from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { IoCloseOutline } from "react-icons/io5";
import { FaTrash, FaShoppingBag } from "react-icons/fa";
import { MdAdd, MdRemove, MdShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";

const CartDrawer = ({ open, onClose, onCheckout, onAuthRequired }) => {
  const { items, totalQty, subtotal, updateQty, removeFromCart, clearCart } = useCart();
  const { isLoggedIn } = useAuth();

  const shipping = subtotal >= 100 ? 0 : subtotal > 0 ? 9.99 : 0;
  const tax      = subtotal * 0.08;
  const total    = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!isLoggedIn) {
      onClose();
      onAuthRequired();
      return;
    }
    onClose();
    onCheckout();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white dark:bg-gray-900 shadow-2xl z-[9999]
          flex flex-col transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <MdShoppingCart className="text-primary text-xl" />
            <h2 className="font-bold text-lg dark:text-white">My Cart</h2>
            {totalQty > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalQty}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-500 duration-200 flex items-center gap-1"
              >
                <FaTrash className="text-xs" /> Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-white duration-200"
            >
              <IoCloseOutline className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 pb-10">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                <FaShoppingBag className="text-gray-300 dark:text-gray-600 text-4xl" />
              </div>
              <div>
                <p className="font-semibold text-gray-500 dark:text-gray-400 mb-1">Your cart is empty</p>
                <p className="text-xs text-gray-400">Add some products to get started</p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 bg-gradient-to-r from-primary/80 to-secondary text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:scale-105 duration-200"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 group"
                >
                  {/* Product image placeholder / actual img */}
                  <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                    {item.img ? (
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">🚗</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm dark:text-white leading-tight truncate">{item.name}</p>
                    <p className="text-primary font-bold text-sm mt-0.5">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => updateQty(item.productId, -1)}
                      className="w-7 h-7 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:border-primary hover:text-primary duration-200 text-gray-600 dark:text-gray-300"
                    >
                      <MdRemove className="text-sm" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold dark:text-white">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.productId, 1)}
                      className="w-7 h-7 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:border-primary hover:text-primary duration-200 text-gray-600 dark:text-gray-300"
                    >
                      <MdAdd className="text-sm" />
                    </button>
                  </div>

                  {/* Line total + remove */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <p className="text-sm font-bold dark:text-white">${(item.price * item.qty).toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-gray-300 hover:text-red-500 duration-200"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Free shipping nudge */}
              {subtotal > 0 && subtotal < 100 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl px-4 py-3 text-center">
                  <p className="text-xs text-orange-700 dark:text-orange-400 font-medium">
                    🚚 Add <strong>${(100 - subtotal).toFixed(2)}</strong> more for FREE shipping!
                  </p>
                  <div className="mt-2 h-1.5 bg-orange-200 dark:bg-orange-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {subtotal >= 100 && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-2.5 text-center">
                  <p className="text-xs text-green-700 dark:text-green-400 font-semibold">
                    🎉 You've unlocked FREE shipping!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer — summary + checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-4 bg-white dark:bg-gray-900">
            {/* Totals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Subtotal ({totalQty} item{totalQty !== 1 ? "s" : ""})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-500 font-semibold" : ""}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-base pt-2 border-t border-gray-100 dark:border-gray-800 dark:text-white">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3.5 rounded-2xl hover:scale-[1.02] duration-200 shadow-lg flex items-center justify-center gap-2 text-base"
            >
              <MdShoppingCart className="text-lg" />
              {isLoggedIn ? "Proceed to Checkout" : "Sign In to Checkout"}
            </button>

            {!isLoggedIn && (
              <p className="text-center text-xs text-gray-400 mt-2">
                <Link to="/login" onClick={onClose} className="text-primary hover:underline">Sign in</Link>
                {" "}or{" "}
                <Link to="/register" onClick={onClose} className="text-primary hover:underline">create an account</Link>
                {" "}to place your order
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
