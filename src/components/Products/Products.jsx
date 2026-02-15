import React from 'react'
import Img1 from "./img1.png";
import Img2 from "./img2.png";
import Img3 from "./img3.png";
import Img4 from "./img4.png";
import Img5 from "./img5.png";
import {FaStar} from "react-icons/fa6";

const ProductsData=[
    {
    id: 1,
    img: Img1,
    title: "Interior Accesories",
    rating: 5,
    color: "white",
    aosDelay: "0",
    },
    {
    id: 2,
    img: Img2,
    title: "Mats",
    rating: 4.5,
    color: "Red&Black",
    aosDelay: "200",
    },
    {
    id: 3,
    img: Img3,
    title: "Car Covers",
    rating: 4.7,
    color: "Black",
    aosDelay: "400",
    },
    {
    id: 4,
    img: Img4,
    title: "Car interior Renovation Spray",
    rating: 4.4,
    color: "Black",
    aosDelay: "600",
    },
    {
    id: 5,
    img: Img5,
    title: "Rims",
    rating: 4.5,
    color: "Gold",
    aosDelay: "800",
    },
];

export const Products = () => {
  return (
    <div className="mt-14 mb-12">
        <div className="container">
        {/* Header Section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
            <p data-aos="fade-up" className="text-sm text-primary">
                Top Selling Products for you
            </p>
            <h1 data-aos="fade-up" className=" text-3xl font bold">Products</h1>
            <p data-aos="fade-up"className="text-xs text-gray-400">Lorem ipsum dolor sit, amet consectetur 
            adipisicing elit. Earum vel corporis quia 
            culpa quibusdam animi quis accusantium ipsum.
            Fugiat eligendi omnis nulla laudantium. Sapiente
            a deserunt excepturi vero, corrupti eos!</p>
        </div>
        {/* Body Section */}
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 ms:grid-cols-4
             lg:grid-cols-5 place-items-center gap-5">
                {/* card section */}
                {
                ProductsData.map((data)=>(
                <div 
                data-aos="fade-up" 
                data-aos-delay={data.aosDelay}
                key={data.id} className="space-y-3">
                    <img src={data.img} alt="" className="h-[200px]
                     w-[150px] object-cover rounded-md hover:scale-105 duration-200"/>
                <div>
                    <h3 className="font-semibold">{data.title}</h3>
                    <p className="text-sm text-gray-600">
                        {data.color}
                    </p>
                    <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400"/>
                        <span>{data.rating}</span>
                        </div>
                    </div>
                </div>
                ))
                }
                </div>
                {/* view all button */}
                <div className="flex justify-center">
                    <button
                    className="text-center mt-10 cursor-pointer
                     bg-primary text-white py-1 px-4 rounded-md"
                    >View All Button</button>
                </div>
        </div>
        </div>
    </div>
  )
};

export default Products;