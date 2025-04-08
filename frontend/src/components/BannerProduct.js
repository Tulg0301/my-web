"use client"
import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const BannerProduct = () => {
    const desktopImages = [
        "/banner/banner1.jpg",
        "/banner/banner2.jpg",
        "/banner/banner3.jpg",
        "/banner/banner4.jpg"
    ];
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    
    const nextSlide = () => {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => prevIndex + 1);
    };

    const prevSlide = () => {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => prevIndex - 1);
    };
    
    useEffect(() => {
        const interval = setInterval(nextSlide, 3000); // Tự động chuyển ảnh sau mỗi 3 giây
        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        if (currentIndex === desktopImages.length) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);
            }, 700); // Delay để tránh giật hình khi reset
        }
        if (currentIndex === -1) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(desktopImages.length - 1);
            }, 700);
        }
    }, [currentIndex]);
    
    return (
        <div className='container mx-auto  rounded overflow-hidden relative px-4 md:px-8'>
            <div className='relative w-full md:h-72 bg-slate-200 overflow-hidden flex'>
                <div 
                    className='flex transition-transform duration-700 ease-in-out'
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: isTransitioning ? 'transform 0.7s ease-in-out' : 'none'
                    }}
                >
                    {[...desktopImages, desktopImages[0]].map((imageUrl, index) => (
                        <div key={index} className='w-full flex-shrink-0'>
                            <img 
                                src={imageUrl} 
                                className='w-full h-full object-container' 
                                alt={`Banner ${index + 1}`} 
                            />
                        </div>
                    ))}
                </div>
            </div>
            {/* Nút điều hướng */}
            <button 
                className='absolute top-1/2 left-8 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-50 hover:opacity-100'
                onClick={prevSlide}
            >
                <FaChevronLeft size={20} />
            </button>
            <button 
                className='absolute top-1/2 right-8 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-50 hover:opacity-100'
                onClick={nextSlide}
            >
                <FaChevronRight size={20} />
            </button>
        </div>
    );
};

export default BannerProduct;