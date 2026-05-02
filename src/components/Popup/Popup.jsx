import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';

export const Popup = ({ orderPopup, setOrderPopup }) => {
  return (
    <>
      {orderPopup && (
        <div className="popup">
          <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 shadow-xl bg-white dark:bg-gray-900 rounded-2xl duration-200 w-[320px] sm:w-[380px]">

              {/* header */}
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-lg font-bold dark:text-white">Place Your Order</h1>
                <IoCloseOutline
                  className="text-2xl cursor-pointer text-gray-500 hover:text-gray-800 dark:hover:text-white duration-200"
                  onClick={() => setOrderPopup(false)}
                />
              </div>

              {/* form */}
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Delivery Address"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
                <div className="flex justify-center mt-2">
                  <button className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2.5 px-8 rounded-full font-semibold shadow-md">
                    Confirm Order
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
