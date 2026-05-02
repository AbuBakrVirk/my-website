import React from 'react';
import Image2 from "./image2.png";
import Image3 from "./image3.png";
import Image1 from "./image1.png";
import ReactSlick from "react-slick";
import { FaArrowRight } from "react-icons/fa";
const Slider = ReactSlick.default || ReactSlick;

const ImageList = [
  {
    id: 1,
    img: Image1,
    tag: "Flash Deal",
    title: "30% OFF Everything",
    description: "Today Only — Upgrade Your Ride with 30% OFF Storewide!",
    badge: "🔥 Limited Time",
  },
  {
    id: 2,
    img: Image2,
    tag: "Wheels & Tires",
    title: "30% OFF Rims",
    description: "Roll in Style with 30% OFF Wheels & Tires!",
    badge: "🛞 New Arrivals",
  },
  {
    id: 3,
    img: Image3,
    tag: "Performance",
    title: "30% OFF Upgrades",
    description: "Boost Your Ride — Performance Parts at 30% OFF!",
    badge: "⚡ Best Sellers",
  },
];

const Hero = ({ handleOrderPopup }) => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
    dotsClass: "slick-dots !bottom-4",
  };

  return (
    <div className="relative overflow-hidden min-h-[520px] sm:min-h-[600px] md:min-h-[660px]
      bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900
      flex justify-center items-center duration-200">

      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full
        blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/10 rounded-full
        blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="container px-4 w-full">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center py-10 sm:py-16">

                {/* Text */}
                <div className="flex flex-col justify-center gap-5 text-center sm:text-left
                  order-2 sm:order-1 relative z-10">

                  {/* Badge */}
                  <div
                    data-aos="fade-right"
                    data-aos-duration="500"
                    data-aos-once="true"
                    className="inline-flex items-center gap-2 self-center sm:self-start"
                  >
                    <span className="bg-primary/10 dark:bg-primary/20 text-primary text-xs font-bold
                      px-3 py-1.5 rounded-full border border-primary/20 tracking-wide">
                      {data.badge}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-widest">
                      {data.tag}
                    </span>
                  </div>

                  {/* Headline */}
                  <h1
                    data-aos="zoom-out"
                    data-aos-duration="600"
                    data-aos-once="true"
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold
                      leading-none tracking-tight dark:text-white"
                  >
                    {data.title.split(" ").map((word, i) =>
                      word.includes("%") || word === "OFF" ? (
                        <span key={i} className="text-gradient"> {word} </span>
                      ) : (
                        <span key={i}> {word} </span>
                      )
                    )}
                  </h1>

                  <p
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="100"
                    data-aos-once="true"
                    className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-sm mx-auto sm:mx-0"
                  >
                    {data.description}
                  </p>

                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="200"
                    data-aos-once="true"
                    className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start"
                  >
                    <button
                      onClick={handleOrderPopup}
                      className="group inline-flex items-center justify-center gap-2
                        bg-gradient-to-r from-primary to-secondary text-white
                        font-bold py-3 px-7 rounded-full hover:shadow-glow
                        hover:scale-105 duration-300 text-sm sm:text-base"
                    >
                      Order Now
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                    <button
                      onClick={handleOrderPopup}
                      className="inline-flex items-center justify-center gap-2
                        border-2 border-primary/40 text-primary dark:text-primary
                        font-semibold py-3 px-7 rounded-full hover:bg-primary/5
                        duration-200 text-sm sm:text-base"
                    >
                      View Deals
                    </button>
                  </div>
                </div>

                {/* Image */}
                <div className="order-1 sm:order-2 flex justify-center">
                  <div
                    data-aos="zoom-in"
                    data-aos-once="true"
                    className="relative"
                  >
                    {/* Glow ring */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20
                      rounded-full blur-2xl scale-110 pointer-events-none" />
                    <img
                      src={data.img}
                      alt={data.title}
                      className="relative z-10 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px]
                        md:w-[380px] md:h-[380px] lg:w-[420px] lg:h-[420px]
                        object-contain mx-auto drop-shadow-2xl
                        hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;
