import React from 'react';
import ReactSlick from 'react-slick';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
const Slider = ReactSlick.default || ReactSlick;

const TestimonialsData = [
  {
    id: 1,
    name: "Farhan A.",
    role: "Car Enthusiast",
    text: "MOTORLY never disappoints! The parts were 100% genuine and perfectly fit my car. Fast delivery and excellent packaging. Highly recommended!",
    img: "https://picsum.photos/seed/farhan/80/80",
    rating: 5,
  },
  {
    id: 2,
    name: "Babar Azam",
    role: "Daily Driver",
    text: "Ordered brake pads and received them within 2 days. Amazing service and very responsive support team. MOTORLY is now my go-to car parts store.",
    img: "https://picsum.photos/seed/babar/80/80",
    rating: 5,
  },
  {
    id: 3,
    name: "Usman K.",
    role: "Mechanic",
    text: "The website is easy to use and finding parts was super simple. Checkout was smooth and secure. Great experience overall!",
    img: "https://picsum.photos/seed/usman/80/80",
    rating: 5,
  },
  {
    id: 4,
    name: "Naseem Shah",
    role: "Performance Builder",
    text: "Top-notch service and premium quality products. MOTORLY truly feels like a trusted automotive partner. Must check!",
    img: "https://picsum.photos/seed/naseem/80/80",
    rating: 5,
  },
];

export const Testimonials = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640,  settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-16 sm:py-20 duration-200">
      <div className="container px-4">

        {/* Header */}
        <div className="text-center mb-12 max-w-xl mx-auto">
          <p data-aos="fade-up" className="text-primary text-sm font-bold uppercase tracking-widest mb-2">
            Customer Reviews
          </p>
          <h2 data-aos="fade-up" className="text-3xl sm:text-4xl font-extrabold dark:text-white mb-3">
            What Our Customers Say
          </h2>
          <p data-aos="fade-up" className="text-gray-400 text-sm sm:text-base">
            Trusted by 50,000+ car enthusiasts across Pakistan.
          </p>
        </div>

        {/* Slider */}
        <div data-aos="fade-up">
          <Slider {...settings}>
            {TestimonialsData.map((t) => (
              <div key={t.id} className="px-3 py-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card
                  hover:shadow-card-hover border border-gray-100 dark:border-gray-800
                  transition-all duration-300 hover:-translate-y-1 relative overflow-hidden h-full">

                  {/* Quote icon */}
                  <FaQuoteLeft className="text-primary/10 text-5xl absolute top-4 right-4" />

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-sm" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5 line-clamp-4">
                    "{t.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div>
                      <p className="font-bold text-sm dark:text-white">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
