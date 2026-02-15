import React from 'react'
import Products from '../Products/Products';
import Img1 from "./img1.png";
import Img2 from "./img2.png";
import Img3 from "./img3.png";
import {FaStar} from "react-icons/fa";

const ProductsData=[
    {
    id: 1,
    img: Img1,
    title: "Premium Leather Seat Covers",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, eaque.",
    },
    {
    id: 2,
    img: Img2,
    title: "Ambient LED Interior Lights",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, eaque.",
    },{
    id: 3,
    img: Img3,
    title: "Car Armrest Organizer",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, eaque.",
    },
]


export const TopProducts = ({handleOrderPopup}) => {
  return (
    <div>
      <div className="container">
      {/* Header Section */}
      <div className="text-left mb-24 ">
            <p data-aos="fade-up" className="text-sm text-primary">
                Top Rated Products for you
            </p>
            <h1 data-aos="fade-up" 
             className="text-3xl font-bold">
                Best Products
            </h1>
            <p data-aos="fade-up" className="text-sm text-gray-400">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
            Dolorem a voluptatum ratione velit inventore, totam consequatur
            officia doloremque mollitia cupiditate. Velit accusamus officia 
            corporis hic aliquam et voluptas animi quod.
              </p>
         </div>
      {/* Body section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 
      md:grid-cols-3 gap-20 md:gap-5 place-items-center">
        {
          ProductsData.map((data)=>(
            <div
            data-aos="zoom-in"
            className="rounded-2xl bg-white dark:bg-gray-800
             hover:bg-black/80 dark:hover:bg-primary hover:text-white
              relative shadow-xl duration-300 group max-w-[300px]
            "
            >
              {/* image section */}
                  <div className="h-[100px]">
                  <img src={data.img} alt=""
                  className="max-w-[150px] block mx-auto transform
                   -translate-y-20 group-hover:scale-105 duration-300
                    drop-shadow-md"
                   />
                  </div>
                  {/* details section */}
                  <div className="p-3 text-center" 
                  >
                   {/* star rating */}
                   <div className="w-full flex items-center
                    justify-center gap-1">
                      <FaStar className="text-yellow-500"/>
                      <FaStar className="text-yellow-500"/>
                      <FaStar className="text-yellow-500"/>
                      <FaStar className="text-yellow-500"/>
                    </div>
                  <h1 className="text-xl font-bold">
                    {data.title}
                  </h1>
                    <p
                    className="text-gray-500 group-hover:text-white
                     duration-300 text-sm line-clamp-2">
                      {data.description}
                    </p>
                    <button
                    className="bg-primary hover:scale-105 duration-300
                     text-white py-1 px-4 rounded-full mt-4
                      group-hover:bg-white group-hover:text-primary"
                      onClick={handleOrderPopup}
                      >
                          Order Now
                    </button>
                    </div>
                    </div>
          ))}
      </div>
      </div>
    </div>
  )
}

export default TopProducts;