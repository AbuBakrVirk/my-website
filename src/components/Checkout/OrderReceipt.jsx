import React, { useRef } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { MdCheckCircle, MdEmail, MdLocationOn, MdPayment } from "react-icons/md";
import { FaShippingFast, FaPrint } from "react-icons/fa";
import logo from "../../assets/logo.png";

const OrderReceipt = ({ order, onClose }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=700,height=900");
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Receipt #${order.id}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; padding: 32px; }
            .header { background: linear-gradient(135deg,#fea928,#ed8900); color: white; padding: 24px 32px; border-radius: 12px; margin-bottom: 24px; }
            .header h1 { font-size: 28px; font-weight: 800; }
            .badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 6px 16px; border-radius: 50px; font-size: 13px; font-weight: 700; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; }
            th { background: #f3f4f6; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; color: #6b7280; }
            td { padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
            .total-row td { font-weight: 800; font-size: 16px; color: #fea928; border-top: 2px solid #f3f4f6; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; }
            .info-box { background: #f9fafb; border-radius: 8px; padding: 14px; }
            .info-box p { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
            .info-box strong { font-size: 14px; color: #111; }
            .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #f3f4f6; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto duration-200">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <MdCheckCircle className="text-green-500 text-2xl" />
            <h2 className="text-lg font-bold dark:text-white">Order Confirmed!</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary duration-200 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg"
            >
              <FaPrint className="text-xs" /> Print
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 duration-200">
              <IoCloseOutline className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Printable receipt content */}
        <div ref={printRef} className="px-6 py-5">

          {/* Print-only header */}
          <div className="hidden print:block mb-6 p-6 bg-gradient-to-r from-primary to-secondary rounded-xl text-white text-center">
            <h1 className="text-3xl font-extrabold">🚗 Motorly</h1>
            <p className="text-white/80 text-sm mt-1">Premium Automotive Store</p>
          </div>

          {/* Success banner */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-3">
              <MdCheckCircle /> Payment Successful
            </div>
            <h3 className="text-xl font-bold dark:text-white">Thank you for your order!</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Order <span className="text-primary font-bold">#{order.id}</span>
            </p>
          </div>

          {/* Email notice */}
          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 mb-5">
            <MdEmail className="text-blue-500 text-xl flex-shrink-0" />
            <p className="text-blue-700 dark:text-blue-300 text-xs">
              A detailed receipt has been emailed to <strong>{order.userEmail}</strong>
            </p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: "Order Date",    value: new Date(order.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}), icon: "📅" },
              { label: "Payment",       value: order.paymentMethod, icon: "💳" },
              { label: "Delivery",      value: order.address,       icon: "📍" },
              { label: "Est. Delivery", value: "3–5 Business Days", icon: "🚚" },
            ].map((info) => (
              <div key={info.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">{info.icon} {info.label}</p>
                <p className="text-sm font-semibold dark:text-white leading-tight">{info.value}</p>
              </div>
            ))}
          </div>

          {/* Items */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Order Items</p>
            <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="text-left px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Product</th>
                    <th className="text-center px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Qty</th>
                    <th className="text-right px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-3 dark:text-white">{item.name}</td>
                      <td className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">{item.qty}</td>
                      <td className="px-4 py-3 text-right font-semibold dark:text-white">${item.lineTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Shipping</span>
              <span className={order.shipping === 0 ? "text-green-500 font-medium" : ""}>
                {order.shipping === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Tax (8%)</span><span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-base pt-2 border-t border-gray-200 dark:border-gray-700 dark:text-white">
              <span>Total Paid</span>
              <span className="text-primary text-lg">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Print footer */}
          <div className="text-center text-xs text-gray-400 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p>© {new Date().getFullYear()} Motorly — Premium Automotive Store</p>
            <p className="mt-1">Questions? Contact us at support@motorly.com</p>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 py-4 flex gap-3 rounded-b-2xl">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 duration-200"
          >
            <FaPrint /> Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-primary/80 to-secondary text-white font-semibold py-3 rounded-xl hover:scale-[1.02] duration-200 shadow-md"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
