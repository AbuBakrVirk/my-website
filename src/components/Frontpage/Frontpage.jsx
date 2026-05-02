import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Frontpage() {
    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage:
                        'url(https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=90)',
                }}
            />
            {/* Multi-layer dark overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                >
                    {/* Eyebrow */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <span className="w-8 sm:w-12 h-0.5 bg-primary/30" />
                        <span className="text-primary/30 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">
                            Premium Automotive
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        className="font-bebas text-[clamp(3rem,12vw,8rem)] sm:text-[clamp(5rem,14vw,12rem)] leading-none text-white tracking-tight mb-4"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.3 }}
                    >
                        Upgrade Your
                        <br />
                        <span className="text-primary/30">Drive.</span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        className="text-base sm:text-xl md:text-2xl text-gray-300 font-light max-w-full sm:max-w-xl mb-10 leading-relaxed"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.5 }}
                    >
                        Premium Car Accessories for True Enthusiasts.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    >
                        <a
                            href="#shop"
                            id="hero-shop-now"
                            className="group inline-flex items-center gap-2 bg-primary/30 hover:bg-primary/30 
                            text-white font-semibold tracking-widest uppercase text-sm sm:text-base px-8 sm:px-10 py-3 sm:py-4 
                            transition-all duration-300 hover:shadow-[0_0_30px_rgba(169,113,66,0.5)] hover:scale-105"
                        >
                            Shop Now
                            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                        </a>
                        <a
                            href="#categories"
                            className="inline-flex items-center gap-2 border border-gray-600
                             hover:border-primary/30 text-gray-300 hover:text-white font-medium 
                             tracking-widest uppercase text-sm sm:text-base px-8 sm:px-10 py-3 sm:py-4 transition-all duration-300"
                        >
                            Browse Categories
                        </a>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-6 sm:gap-12 mt-16 mb-10 pt-8 border-t border-gray-800/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                    >
                        {[
                            { value: '10K+', label: 'Products' },
                            { value: '50K+', label: 'Customers' },
                            { value: '4.9★', label: 'Rating' },
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center sm:items-start">
                                <div className="font-bebas text-2xl sm:text-3xl text-primary/40 tracking-wider">{stat.value}</div>
                                <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-widest mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
                <span className="text-xs sm:text-sm tracking-widest uppercase">Scroll</span>
                <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5" />
            </motion.div>
        </section>
    );
}