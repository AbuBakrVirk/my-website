import React from 'react';
import BannerImg from "./BannerImg.png";
import { FaShieldAlt, FaTruck, FaCreditCard, FaHeadset } from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  {
    icon: <FaShieldAlt />,
    title: "100% Genuine",
    desc: "Verified authentic products only",
    color: "bg-violet-500/10 text-violet-500 dark:bg-violet-500/20",
  },
  {
    icon: <FaTruck />,
    title: "Fast Delivery",
    desc: "Same-day dispatch before 3 PM",
    color: "bg-orange-500/10 text-orange-500 dark:bg-orange-500/20",
  },
  {
    icon: <FaCreditCard />,
    title: "Secure Payment",
    desc: "Multiple payment options",
    color: "bg-green-500/10 text-green-500 dark:bg-green-500/20",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 Support",
    desc: "Expert help anytime",
    color: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
  },
];

export const Banner = () => {
  return (
    <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-950 duration-200">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Image */}
          <div data-aos="zoom-in" className="flex justify-center order-2 lg:order-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/10
                rounded-3xl blur-3xl scale-110 pointer-events-none" />
              <img
                src={BannerImg}
                alt="Winter Sale"
                className="relative z-10 max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] w-full
                  object-cover rounded-2xl shadow-2xl hover:scale-[1.02] transition-transform duration-500"
              />
              {/* Sale badge */}
              <div className="absolute -top-4 -right-4 z-20 bg-gradient-to-br from-primary to-secondary
                text-white font-extrabold text-lg w-20 h-20 rounded-full flex flex-col items-center
                justify-center shadow-glow animate-pulse-slow">
                <span className="text-xs font-semibold leading-none">UP TO</span>
                <span className="text-2xl leading-none">50%</span>
                <span className="text-xs font-semibold leading-none">OFF</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6 order-1 lg:order-2 text-center lg:text-left">
            <div data-aos="fade-up">
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                Winter Sale
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-2 leading-tight dark:text-white">
                Upgrade Your Ride
                <br />
                <span className="text-gradient">Save Big This Season</span>
              </h2>
            </div>

            <p data-aos="fade-up" className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
              Premium car accessories at unbeatable prices. Limited time offer — don't miss out on the biggest sale of the year.
            </p>

            {/* Feature grid */}
            <div data-aos="fade-up" className="grid grid-cols-2 gap-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl p-3
                    border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover
                    transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className={`p-2.5 rounded-xl flex-shrink-0 text-base ${f.color}`}>
                    {f.icon}
                  </div>
                  <div className="text-left min-w-0">
                    <p className="font-semibold text-xs sm:text-sm dark:text-white leading-tight">{f.title}</p>
                    <p className="text-xs text-gray-400 leading-tight mt-0.5 hidden sm:block">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Banner;
