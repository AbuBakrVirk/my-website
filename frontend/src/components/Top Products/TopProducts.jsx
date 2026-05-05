import React, { useState } from 'react';
import Img1 from "./img1.png";
import Img2 from "./img2.png";
import Img3 from "./img3.png";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import { useCart } from "../../context/CartContext";

const ProductsData = [
  {
    id: "p6",
    img: Img1,
    title: "Premium Leather Seat Covers",
    description: "High-quality genuine leather seat covers for a luxurious interior upgrade.",
    price: 109.99,
    rating: 4,
  },
  {
    id: "p7",
    img: Img2,
    title: "Ambient LED Interior Lights",
    description: "RGB ambient lighting kit with app control for a premium cabin atmosphere.",
    price: 34.99,
    rating: 5,
  },
  {
    id: "p8",
    img: Img3,
    title: "Car Armrest Organizer",
    description: "Multi-compartment organizer that keeps your center console tidy and accessible.",
    price: 14.99,
    rating: 4,
  },
];

const TopProductCard = ({ data, handleOrderPopup }) => {
  const { addToCart, isInCart } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = isInCart(data.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ id: data.id, name: data.title, price: data.price, img: data.img });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      data-aos="zoom-in"
      className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-gray-900 dark:hover:bg-primary
                 hover:text-white relative shadow-xl duration-300 group w-full max-w-[300px]
                 mt-16 sm:mt-20"
    >
      {/* Floating image — reduced offset on mobile */}
      <div className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none">
        <img
          src={data.img}
          alt={data.title}
          className="w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] object-cover rounded-xl
            group-hover:scale-105 duration-300 drop-shadow-xl"
        />
      </div>

      {/* Details */}
      <div className="pt-16 sm:pt-20 pb-5 px-4 text-center">
        {/* Stars */}
        <div className="flex justify-center items-center gap-0.5 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar key={i} className={`text-sm ${i < data.rating ? "text-yellow-400" : "text-gray-200 dark:text-gray-600"}`} />
          ))}
        </div>

        <h1 className="text-sm sm:text-base font-bold mb-1 leading-tight">{data.title}</h1>
        <p className="text-primary group-hover:text-yellow-300 font-extrabold text-base sm:text-lg mb-1">${data.price}</p>
        <p className="text-gray-500 group-hover:text-gray-300 duration-300 text-xs sm:text-sm line-clamp-2 mb-4">
          {data.description}
        </p>

        {/* Buttons */}
        <div className="flex gap-2 justify-center flex-wrap">
          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 sm:px-4 py-2 rounded-full border-2 duration-200 ${
              inCart || added
                ? "border-green-500 bg-green-500 text-white"
                : "border-gray-300 bg-white text-gray-800 hover:border-primary hover:text-primary group-hover:border-white group-hover:bg-white group-hover:text-primary"
            }`}
          >
            {added ? <><MdCheckCircle /> Added!</>
              : inCart ? <><MdCheckCircle /> In Cart</>
              : <><FaShoppingCart className="text-xs" /> Add to Cart</>}
          </button>

          <button
            onClick={() => handleOrderPopup({ id: data.id, name: data.title, price: data.price, img: data.img })}
            className="text-xs font-semibold px-3 sm:px-4 py-2 rounded-full bg-primary text-white
              group-hover:bg-white group-hover:text-primary duration-200 hover:scale-105"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export const TopProducts = ({ handleOrderPopup }) => {
  return (
    <div className="py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-left mb-6 space-y-2">
          <p data-aos="fade-up" className="text-sm text-primary font-semibold uppercase tracking-wider">
            Top Rated Products
          </p>
          <h1 data-aos="fade-up" className="text-3xl sm:text-4xl font-bold">
            Best Products
          </h1>
          <p data-aos="fade-up" className="text-sm sm:text-base text-gray-400 max-w-2xl">
            Our most loved products, hand-picked by thousands of satisfied customers.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 justify-items-center pt-16 sm:pt-20">
          {ProductsData.map((data) => (
            <TopProductCard key={data.id} data={data} handleOrderPopup={handleOrderPopup} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
