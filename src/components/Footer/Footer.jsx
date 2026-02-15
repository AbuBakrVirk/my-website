import React from 'react'
import footerlogo from "./footerlogo.jpg";
import banner from "./footer-banner.jpg";
import { 
    FaInstagram, 
    FaFacebook,
    FaLinkedin,
    FaLocationArrow,
    FaMobileAlt,
} from 'react-icons/fa';

const BannerImg={
backgroundImage: `url(${banner})`,
backgroundSize: "cover",
backgroundRepeat: "no-repeat",
backgroundPosition: "bottom",
height:"100%",
width: "100%",
};

const FooterLinks=[
    {
        title: "Home",
        links: "/#"
    },
     {
        title: "About",
        links: "/#about"
    },
     {
        title: "Contact",
        links: "/#contact"
    },
     {
        title: "Blog",
        links: "/#blog"
    },
]


export const Footer = () => {
  return (
    <div style={BannerImg} 
    className="text-white mb-20">
        <div className="container">
            <div
             data-aos="zoom-in"
            className="grid md:grid-cols-3 pb-44 pt-5">
                {/* company details */}
                <div className="py-8 px-4">
                    <h1 className="sm:text-3xl text-xl font-bold
                     sm:text-left text-justify mb-3 flex items-center gap-3">
                        <img src={footerlogo} alt="" 
                        className="max-w-[50px]"/>
                        Motorly
                    </h1>
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi eius accusamus natus delectus quibusdam a odit animi harum porro hic soluta 
                        neque quas sunt deserunt nemo, minus vitae eaque est!
                    </p>
                </div>
                {/* footer links */}
                <div className="grid grid-cols-2 sm:grid-cols-3
                 col-span-2 md:pl-10">
                    <div>
                        <div className="py-8 px-4">
                        <h1 className="sm:text-3xl text-xl
                         font-bold sm:text-left text-justify mb-3">
                         Links</h1>
                            <ul className="flex flex-col gap-3" >
                                {
                                    FooterLinks.map((links)=>(
                                        <li className="cursor-pointer hover:text-primary
                                         hover:translate-x-1 duration-300 text-gray-200" 
                                         key={links.title}>
                                            <span>
                                                {links.title}
                                            </span>
                                        </li>
                                    ))
                                }
                            </ul>
                    </div>
                    </div>
                    {/* social links */}
                    <div>
                        <div className="flex items-center
                         gap-3 mt-6">
                            <a href="#">
                                <FaInstagram className="text-3xl"/>
                            </a>
                             <a href="#">
                                <FaFacebook className="text-3xl"/>
                            </a>
                             <a href="#">
                                <FaLinkedin className="text-3xl"/>
                            </a>
                        </div>
                        <div className="mt-6">
                            <div className="flex items-center gap-3">
                                <FaLocationArrow/>
                                <p>Islamabad, Pakistan</p>
                            </div>
                            <div className="flex items-center gap-3 mt-3">
                                <FaMobileAlt/>
                                <p>+92 300 1234567</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer;