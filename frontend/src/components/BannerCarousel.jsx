import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingBag } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function BannerCarousel({ banners }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const { language, t } = useLanguage();
    const navigate = useNavigate();

    // Auto-play functionality
    useEffect(() => {
        if (!banners || banners.length <= 1) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 6000); // 6 seconds for better reading time

        return () => clearInterval(interval);
    }, [currentIndex, banners]);

    const nextSlide = useCallback(() => {
        if (!banners || banners.length === 0) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, [banners]);

    const prevSlide = useCallback(() => {
        if (!banners || banners.length === 0) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }, [banners]);

    const goToSlide = (index) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    const currentBanner = banners && banners.length > 0 ? banners[currentIndex] : null;

    if (!currentBanner || !currentBanner.product_id) {
        return null;
    }

    // Animation variants
    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            x: direction > 0 ? '-100%' : '100%',
            opacity: 0,
        }),
    };

    const handleProductClick = () => {
        navigate(`/product/${currentBanner.product_id}`);
    };

    return (
        <div className="relative w-full bg-stone-50 overflow-hidden group">
            {/* Banner Container */}
            <div className="relative h-[600px] sm:h-[650px] md:h-[600px] flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.4 },
                            }}
                            className="absolute inset-0 flex flex-col md:flex-row items-center justify-center md:justify-between py-8 md:py-0 w-full h-full"
                        >
                            {/* Image Side (On top for mobile) */}
                            <div className="w-full md:w-1/2 h-[250px] sm:h-[300px] md:h-full flex items-center justify-center relative mb-6 md:mb-0 order-1 md:order-2">
                                {/* Decorative Circle Background */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[500px] md:h-[500px] bg-stone-200/50 rounded-full blur-3xl -z-10" />

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, x: 50 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    transition={{ delay: 0.1, duration: 0.6 }}
                                    className="relative w-full h-full flex items-center justify-center p-4 md:p-12"
                                >
                                    {currentBanner.product_image ? (
                                        <img
                                            src={currentBanner.product_image}
                                            alt={currentBanner.product_title}
                                            className="max-h-full max-w-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                            style={{ maxHeight: '90%' }}
                                            onClick={handleProductClick}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-stone-100 rounded-lg text-stone-400">
                                            No Image Available
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Info Side (Below image for mobile) */}
                            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center text-center md:text-left z-10 px-4 md:pl-8 lg:pl-16 order-2 md:order-1">
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                >
                                    <span className="inline-block px-3 py-1 mb-3 sm:mb-4 text-[10px] sm:text-xs font-semibold tracking-wider text-amber-600 bg-amber-50 uppercase rounded-full border border-amber-100/50">
                                        {currentBanner.product_category_slug || 'New Arrival'}
                                    </span>

                                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light text-stone-900 mb-3 sm:mb-6 leading-tight tracking-tight max-w-sm md:max-w-none">
                                        {currentBanner.product_title}
                                    </h1>

                                    <p className="text-sm sm:text-base md:text-lg text-stone-600 mb-6 sm:mb-8 leading-relaxed max-w-xs sm:max-w-md lg:max-w-lg line-clamp-2 md:line-clamp-3">
                                        {currentBanner.product_description}
                                    </p>

                                    <div className="flex items-center justify-center md:justify-start gap-4 mb-6 sm:mb-8">
                                        <div className="text-xl sm:text-2xl font-medium text-stone-900">
                                            {currentBanner.product_discounted_price ? (
                                                <>
                                                    <span className="text-amber-600">{currentBanner.product_discounted_price} TMT</span>
                                                    {Number(currentBanner.product_price) > Number(currentBanner.product_discounted_price) && (
                                                        <span className="ml-2 sm:ml-3 text-base sm:text-lg text-stone-400 line-through decoration-1 decoration-stone-300">
                                                            {currentBanner.product_price} TMT
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <span>{currentBanner.product_price} TMT</span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleProductClick}
                                        className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-stone-900 text-white font-medium text-xs sm:text-sm md:text-base rounded-none hover:bg-stone-800 transition-all duration-300 shadow-xl shadow-stone-200"
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        {t('buyNow') || 'SHOP NOW'}
                                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            </div>

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm text-stone-900 p-3 rounded-full transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 z-20 border border-stone-100"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm text-stone-900 p-3 rounded-full transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 z-20 border border-stone-100"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Dots Navigation */}
            {banners.length > 1 && (
                <div className="absolute bottom-6 left-8 md:left-16 flex gap-2 z-20">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 h-1.5 rounded-full ${index === currentIndex
                                ? 'w-12 bg-stone-900'
                                : 'w-2 bg-stone-300 hover:bg-stone-400'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
