import React, { useState } from 'react';
import Img1 from "./img1.png";
import Img2 from "./img2.png";
import Img3 from "./img3.png";
import Img4 from "./img4.png";
import Img5 from "./img5.png";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductsData = [
  { id: "p1", img: Img1, title: "Interior Accessories", rating: 5,   color: "White",     price: 49.99,  aosDelay: "0"   },
  { id: "p2", img: Img2, title: "Mats",                 rating: 4.5, color: "Red & Black",price: 34.99, aosDelay: "100" },
  { id: "p3", img: Img3, title: "Car Covers",           rating: 4.7, color: "Black",      price: 79.99, aosDelay: "200" },
  { id: "p4", img: Img4, title: "Renovation Spray",     rating: 4.4, color: "Black",      price: 19.99, aosDelay: "300" },
  { id: "p5", img: Img5, title: "Rims",                 rating: 4.5, color: "Gold",       price: 299.99,aosDelay: "400" },
];

/* ── Single product card ── */
const ProductCard = ({ data, handleOrderPopup }) => {
  const { addToCart, isInCart } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = isInCart(data.id);

  const handleAddToCart = () => {
    addToCart({ id: data.id, name: data.title, price: data.price, img: data.img });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={data.aosDelay}
      className="group w-full max-w-[170px] bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-primary/30"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-700">
        <img
          src={data.img}
          alt={data.title}
          className="h-[140px] sm:h-[160px] w-full object-cover group-hover:scale-105 duration-300 cursor-pointer"
          onClick={() => handleOrderPopup && handleOrderPopup({ id: data.id, name: data.title, price: data.price, img: data.img })}
        />
        {/* Quick add overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 duration-300 flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            className="bg-white text-primary font-bold text-xs px-3 py-1.5 rounded-full hover:bg-primary hover:text-white duration-200 flex items-center gap-1.5 shadow-lg"
          >
            <FaShoppingCart className="text-xs" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-3">
        <h3 className="font-semibold text-sm leading-tight dark:text-white mb-0.5 truncate">{data.title}</h3>
        <p className="text-xs text-gray-400 mb-1">{data.color}</p>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              className={`text-xs ${i < Math.floor(data.rating) ? "text-yellow-400" : "text-gray-200 dark:text-gray-600"}`}
            />
          ))}
          <span className="text-xs text-gray-400 ml-0.5">{data.rating}</span>
        </div>
        <p className="text-primary font-extrabold text-sm mb-3">${data.price}</p>

        {/* Buttons */}
        <div className="flex flex-col gap-1.5">
          <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl border-2 duration-200 ${
              inCart || added
                ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                : "border-primary/50 text-primary hover:bg-primary hover:text-white hover:border-primary"
            }`}
          >
            {added ? (
              <><MdCheckCircle className="text-sm" /> Added!</>
            ) : inCart ? (
              <><MdCheckCircle className="text-sm" /> In Cart</>
            ) : (
              <><FaShoppingCart className="text-xs" /> Add to Cart</>
            )}
          </button>
          <button
            onClick={() => handleOrderPopup && handleOrderPopup({ id: data.id, name: data.title, price: data.price, img: data.img })}
            className="w-full bg-gradient-to-r from-primary/80 to-secondary text-white text-xs font-semibold py-2 rounded-xl hover:scale-[1.02] duration-200"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export const Products = ({ handleOrderPopup }) => {
  return (
    <div className="mt-12 sm:mt-14 mb-10 sm:mb-12">
      <div className="container px-4">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 max-w-[600px] mx-auto px-2">
          <p data-aos="fade-up" className="text-xs sm:text-sm text-primary font-semibold uppercase tracking-wider">
            Top Selling Products
          </p>
          <h1 data-aos="fade-up" className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1">
            Products
          </h1>
          <p data-aos="fade-up" className="text-xs sm:text-sm text-gray-400 leading-5 sm:leading-6 mt-2">
            Premium car accessories curated for every enthusiast. Quality guaranteed.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-4 sm:gap-5">
          {ProductsData.map((data) => (
            <ProductCard key={data.id} data={data} handleOrderPopup={handleOrderPopup} />
          ))}
        </div>

        {/* View all */}
        <div className="flex justify-center mt-8 sm:mt-10">
          <Link
            to="/shop"
            onClick={() => setTimeout(() => {
              const el = document.getElementById("products");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 100)}
            className="bg-gradient-to-r from-primary/80 to-secondary text-white font-semibold py-2.5 px-8 rounded-full hover:scale-105 duration-200 shadow-md text-sm sm:text-base"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Products;
