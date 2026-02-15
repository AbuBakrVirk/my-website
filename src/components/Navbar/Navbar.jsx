import React from 'react';
import logo from '../../assets/logo.png';
import { IoMdSearch } from "react-icons/io";
import { FaCaretDown, FaCartShopping } from "react-icons/fa6";
import DarkMode from './DarkMode';


const Menu=[
    {
        id: 1,
        name1: "Home",
        link: "/#",
    },
     {
        id: 2,
        name1: "Top Rated",
        link: "/#services",
    },
     {
        id: 3,
        name1: "Tyres",
        link: "/#",
    },
     {
        id: 3,
        name1: "Interior",
        link: "/#",
    },
     {
        id: 3,
        name1: "Electronics",
        link: "/#",
    },
];

const DropdownLinks=[
    {
        id: 1,
        name1: "Trending Products",
        link: "/#",
    },
     {
        id: 2,
        name1: "Best Selling",
        link: "/#",
    },
     {
        id: 3,
        name1: "Top Rated",
        link: "/#",
    },
];


export const Navbar = ({handleOrderPopup}) => {
  return (
    <div className="shadow-md bg-white dark:bg-gray-900 
    dark:text-white duration-200 relative z-40">
        {/* upper navbar */}
        <div className="bg-primary/40 py-2">
            <div className="container flex justify-between items-center">
                <div>
                <a href="#"
                className="font-bold text-2xl sm:text-3xl flex gap-2">
                    <img  data-aos="fade-up" src={logo} alt="logo" 
                    className="w-10 h-10 uppercase"/>
                    Motorly
                </a>
                </div>
               {/* search bar  */}
               <div className="flex justify-between 
               items-center gap-4">
                <div className="relative group hidden sm:inline-block">
                    <input type="text" placeholder="search"  data-aos="fade-up" 
                    className="w-[200px] sm:w-[200px]
                     group-hover:w-[300px] transition-all
                     duration-300 rounded-full border border-gray-300 
                     px-2 py-1 focus:outline-none focus:border-1
                     focus:border-primary dark:border-gray-500
                      dark:bg-gray-800" />
                     <IoMdSearch
                     className="text-gray-500 
                     group-hover:text-primary absolute top-1/2
                      -translate-y-1/2 right-3" />
                </div>
               </div>
               {/* order button */}
               <button  data-aos="fade-up"  onClick={() => handleOrderPopup()}
               className="bg-gradient-to-r from-primary/50 to-secondary/90 
               transition-all duration-200 text-white py-1 px-4 rounded-full 
               flex items-center gap-3 group">

                <span 
                className="group-hover:block
                hidden transition-all duration-200"
                >Order</span>
                <FaCartShopping
                className="text-xl
                 text-black drop-shadow-sm cursor-pointer"/>
               </button>
               {/* darkmode switch */}
               <div>
                <DarkMode/>
               </div>
            </div>
        </div>
        {/* lower navbar */}
        <div data-aos="zoom-in" 
        className="flex justify-center bg-black text-white">
           <ul className="sm:flex hidden items-center">
            {
                Menu.map((data)=>(
                    <li key={data.id}>
                        <a  data-aos="fade-up"  href={data.link}
                        className="inline-block px-4 hover:text-primary/50 
                        duration-200"
                        >{data.name1}</a>
                    </li>
                ))
            }
            {/* simple dropdown and links */}
            <li className="group relative cursor-pointer">
            <a href="#"
            className="flex items-center  gap-[2px] py-2">
                Trending 
            <span>
                <FaCaretDown className="transition-all duration-200
                 group-hover:rotate-180"/>
            </span>
            </a>
            <div className="absolute z-[9999] hidden group-hover:block w-[150px]
             rounded-md bg-black p-2 text-white shadow-md">
                <ul>
                    {
                    DropdownLinks.map((data)=>(
                        <li key={data.id}>
                            <a href={data.link}
                            className="inline-block w-full
                             rounded-md p-2 hover:bg-primary/50"> 
                                {data.name1}
                            </a>
                        </li>
                    ))
                    }
                    </ul>
            </div>
            </li>
           </ul>
        </div>
   </div>
  );
};

export default Navbar;
